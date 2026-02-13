import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { LawHero } from "@/components/LawHero";
import { LawSearchBar } from "@/components/LawSearchBar";
import { LawFilterSidebar } from "@/components/LawFilterSidebar";
import { DraftCard } from "@/components/DraftCard";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  agency?: string;
  sort?: string;
}>;

async function getDrafts(searchParams: {
  q?: string;
  status?: string;
  agency?: string;
  sort?: string;
}) {
  const { q, status, agency, sort } = searchParams;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { agency: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status === "OPEN" || status === "CLOSED") {
    where.status = status;
  }

  if (agency) {
    where.agency = agency;
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "progress") {
    orderBy = { endDate: "asc" };
  }

  const drafts = await prisma.lawDraft.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { sections: true },
      },
      sections: {
        include: {
          _count: {
            select: { votes: true, comments: true },
          },
        },
      },
    },
  });

  // Calculate vote and comment totals
  const draftsWithCounts = drafts.map((draft) => {
    const totalVotes = draft.sections.reduce(
      (acc, s) => acc + s._count.votes,
      0
    );
    const totalComments = draft.sections.reduce(
      (acc, s) => acc + s._count.comments,
      0
    );
    return { ...draft, totalVotes, totalComments };
  });

  // Sort by popularity if needed
  if (sort === "popular") {
    draftsWithCounts.sort(
      (a, b) => b.totalVotes + b.totalComments - (a.totalVotes + a.totalComments)
    );
  }

  return draftsWithCounts;
}

async function getAgencies() {
  const result = await prisma.lawDraft.findMany({
    select: { agency: true },
    distinct: ["agency"],
    orderBy: { agency: "asc" },
  });
  return result.map((r) => r.agency);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [drafts, agencies] = await Promise.all([
    getDrafts(params),
    getAgencies(),
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Banner Section */}
        <LawHero />

        {/* Search Section */}
        <Suspense fallback={<div className="h-32 bg-gray-50 rounded-2xl animate-pulse mb-10" />}>
          <LawSearchBar />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Draft List */}
          <div className="lg:col-span-9 space-y-4">
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <DraftCard
                  key={draft.id}
                  id={draft.id}
                  title={draft.title}
                  description={draft.description}
                  agency={draft.agency}
                  status={draft.status}
                  startDate={draft.startDate}
                  endDate={draft.endDate}
                  sectionCount={draft._count.sections}
                  voteCount={draft.totalVotes}
                  commentCount={draft.totalComments}
                  // @ts-ignore
                  category={draft.category}
                  // @ts-ignore
                  draftType={draft.draftType}
                  // @ts-ignore
                  hearingRound={draft.hearingRound}
                  // @ts-ignore
                  image={draft.image}
                />
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 text-sm">
                  ไม่พบผลลัพธ์ที่ตรงกับการค้นหา
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  ลองเปลี่ยนคำค้นหาหรือตัวกรอง
                </p>
              </div>
            )}
          </div>

          {/* Right: Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Suspense fallback={<div className="bg-white h-64 rounded-2xl border border-gray-100 animate-pulse" />}>
              <LawFilterSidebar agencies={agencies} />
            </Suspense>

            {/* Floating Action Button (Scroll to top) - Visual match */}
            <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
              <button
                className="h-12 w-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#1a3c7b] hover:bg-gray-50 transition-colors"
                aria-label="Scroll to top"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
