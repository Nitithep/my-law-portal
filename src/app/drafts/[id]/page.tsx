import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { DraftTabs } from "@/components/DraftTabs";
import { ConsentModal } from "@/components/drafts/ConsentModal";
import { HearingSummaryModal } from "@/components/drafts/HearingSummaryModal";
import Link from "next/link";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function DraftDetailPage({ params }: PageProps) {
    const { id } = await params;

    const draft = await prisma.lawDraft.findUnique({
        where: { id },
        include: {
            sections: {
                include: {
                    votes: {
                        select: { type: true },
                    },
                    comments: {
                        include: {
                            user: {
                                select: { name: true, image: true },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    },
                },
                orderBy: { sectionNo: "asc" },
            },
            surveyQuestions: {
                orderBy: { order: "asc" },
                include: {
                    _count: {
                        select: { responses: true },
                    },
                },
            },
            attachments: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!draft) notFound();

    const session = await auth();
    const userId = session?.user?.id;
    const isOpen = draft.status === "OPEN";
    const isClosed = draft.status === "CLOSED";

    const formatDate = (d: Date) =>
        new Date(d).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(draft.endDate);
    const startDate = new Date(draft.startDate);
    const totalDuration = Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const totalVotes = draft.sections.reduce((acc, s) => acc + s.votes.length, 0);
    const totalSurveyResponses = draft.surveyQuestions.reduce((acc, q) => acc + q._count.responses, 0);

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            {/* Header / Nav */}
            <div className="bg-[#1a3c7b] text-white pt-8 pb-16 shadow-sm">
                <div className="container mx-auto px-4 space-y-3">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm bg-[#e74c3c] hover:bg-[#c0392b] px-4 py-2 rounded-full transition-colors font-medium"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            ย้อนกลับ
                        </Link>
                        <h1 className="text-sm font-medium truncate opacity-90 flex-1">
                            การรับฟังความคิดเห็นต่อ{draft.title}
                        </h1>
                    </div>

                    {/* Project Details Toggle */}
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/drafts/${id}`}
                            className="inline-flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <div className="w-5 h-3 bg-[#2b9e76] rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-white" />
                            </div>
                            ดูรายละเอียดโครงการ
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 space-y-6">
                {/* Hero Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image/Icon */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden relative">
                                {draft.image ? (
                                    <div className="w-full h-full relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={draft.image}
                                            alt={draft.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-4xl">🏛️</span>
                                )}
                            </div>
                            {/* Status badge */}
                            <div className="mt-3 flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isOpen
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-gray-100 text-gray-600 border border-gray-200"
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                                    {isOpen ? "เปิด" : "สปช"}
                                </span>
                            </div>
                            <div className="mt-2 flex justify-center">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {draft.agency}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-xl sm:text-2xl font-bold text-[#1a3c7b] leading-tight mb-2">
                                        {draft.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm leading-relaxed max-w-4xl">
                                        {draft.description}
                                    </p>
                                </div>
                                {/* Share & Favorite buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-[#1a3c7b] hover:border-[#1a3c7b]/30 hover:bg-blue-50 transition-all"
                                        title="แชร์"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                                        title="บันทึก"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Tags/Meta */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    {draft.category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    ร่วมเสนอ <span className="bg-[#1a3c7b] text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">{totalVotes}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    ครั้งที่ <span className="bg-[#1a3c7b] text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">{draft.version}</span>
                                </span>
                            </div>

                            {/* Timeline Bar */}
                            <div className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-[#1a3c7b] font-semibold text-sm">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    กม.ลำดับรองอื่นๆ
                                </div>

                                <div className="flex-1 w-full md:w-auto flex items-center gap-3">
                                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                        {formatDate(draft.startDate)}
                                    </span>
                                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden relative">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-[#35599b] rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                        {isOpen && (
                                            <div
                                                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#284a8b] text-white px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap z-10 shadow-sm border border-white/20"
                                                style={{ left: `${progressPercent}%` }}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                เหลือ {daysRemaining} วัน
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                        {formatDate(draft.endDate)}
                                    </span>
                                </div>

                                {isClosed && draft.hearingSummaryPublished && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-[#2b9e76] bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        เผยแพร่สรุปผลการรับฟัง
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    <DraftTabs draft={{
                        ...draft,
                        attachments: draft.attachments || [],
                        hearingSummary: draft.hearingSummary || null,
                        hearingSummaryPublished: draft.hearingSummaryPublished || false,
                    }} isOpen={isOpen} />
                </div>
            </div>

            {/* Sticky Footer */}
            {draft.hearingSummaryPublished && draft.hearingSummary ? (
                <>
                    {/* Mobile */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40 md:hidden">
                        <HearingSummaryModal summary={draft.hearingSummary} draftTitle={draft.title}>
                            <button className="w-full bg-[#2b9e76] hover:bg-[#249068] text-white font-medium py-3 rounded-xl shadow-sm flex items-center justify-center gap-2">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                อ่านสรุปผลการรับฟัง
                            </button>
                        </HearingSummaryModal>
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40">
                        <HearingSummaryModal summary={draft.hearingSummary} draftTitle={draft.title}>
                            <button className="w-full bg-[#2b9e76] hover:bg-[#249068] text-white py-3 px-6 text-center shadow-lg cursor-pointer transition-colors">
                                <span className="font-medium flex items-center justify-center gap-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    อ่านสรุปผลการรับฟัง
                                </span>
                            </button>
                        </HearingSummaryModal>
                    </div>
                </>
            ) : (
                <>
                    {/* Mobile Footer */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40 md:hidden flex justify-between gap-4 items-center">
                        <div>
                            <p className="text-xs text-gray-500">เหลือเวลาอีก</p>
                            <p className="text-[#1a3c7b] font-bold">{daysRemaining} วัน</p>
                        </div>
                        <Link href="#survey" className="flex-1 bg-[#1a3c7b] hover:bg-[#15325f] text-white font-medium py-3 rounded-xl shadow-sm flex items-center justify-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            ร่วมแสดงความคิดเห็น
                        </Link>
                    </div>

                    {/* Desktop Footer (Hidden for now as it duplicates buttons in tabs) */}
                </>
            )}

            <ConsentModal />
        </div>
    );
}
