import { prisma } from "@/lib/db";
import { Suspense } from "react";
import { HeroBanner } from "@/components/HeroBanner";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
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

  const openCount = drafts.filter((d) => d.status === "OPEN").length;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Search Bar */}
      <Suspense fallback={<div className="h-32 bg-white animate-pulse" />}>
        <SearchBar totalResults={drafts.length} />
      </Suspense>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left: Draft List */}
          <div className="flex-1 min-w-0">
            {/* Stats bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                <span className="h-2 w-2 rounded-full bg-[#2b9e76] animate-pulse" />
                เปิดรับฟัง {openCount} โครงการ
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                📊 ทั้งหมด {drafts.length} โครงการ
              </div>
            </div>

            {/* Draft Cards */}
            {drafts.length > 0 ? (
              <div className="space-y-4">
                {drafts.map((draft) => (
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
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
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
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-20">
              <Suspense
                fallback={
                  <div className="h-64 bg-white rounded-xl border border-gray-200 animate-pulse" />
                }
              >
                <FilterSidebar agencies={agencies} />
              </Suspense>

              {/* Additional Info Card */}
              <div className="mt-4 bg-gradient-to-br from-[#1a3c7b] to-[#2b5ea7] rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-semibold">เกี่ยวกับระบบ</span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  ระบบกลางทางกฎหมาย เปิดให้ประชาชนร่วมแสดงความคิดเห็นต่อ
                  ร่างกฎหมายได้ ตามมาตรา 77 ของรัฐธรรมนูญ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
