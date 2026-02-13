import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteDraftButton } from "@/components/admin/DeleteDraftButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const drafts = await prisma.lawDraft.findMany({
        orderBy: { createdAt: "desc" },
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
            surveyQuestions: {
                include: {
                    _count: {
                        select: { responses: true },
                    },
                },
            },
        },
    });

    const totalUsers = await prisma.user.count();

    // Compute stats
    const totalDrafts = drafts.length;
    const openDrafts = drafts.filter((d) => d.status === "OPEN").length;
    const closedDrafts = drafts.filter((d) => d.status === "CLOSED").length;
    const totalVotes = drafts.reduce(
        (acc, d) => acc + d.sections.reduce((a, s) => a + s._count.votes, 0),
        0
    );
    const totalComments = drafts.reduce(
        (acc, d) => acc + d.sections.reduce((a, s) => a + s._count.comments, 0),
        0
    );
    const totalSurveyAnswers = drafts.reduce(
        (acc, d) => acc + d.surveyQuestions.reduce((a, q) => a + q._count.responses, 0),
        0
    );

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-xl font-bold text-gray-800">แดชบอร์ด</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    ภาพรวมข้อมูลระบบรับฟังความคิดเห็น
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <AdminStatCard
                    color="blue"
                    label="ร่างทั้งหมด"
                    value={totalDrafts}
                    subtitle="Law Drafts"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                />
                <AdminStatCard
                    color="emerald"
                    label="กำลังเปิดรับฟัง"
                    value={openDrafts}
                    subtitle="Open"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <AdminStatCard
                    color="orange"
                    label="ปิดรับฟังแล้ว"
                    value={closedDrafts}
                    subtitle="Closed"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                />
                <AdminStatCard
                    color="purple"
                    label="โหวตทั้งหมด"
                    value={totalVotes}
                    subtitle="Total Votes"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
                <AdminStatCard
                    color="rose"
                    label="ความเห็นทั้งหมด"
                    value={totalComments}
                    subtitle="Comments"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    }
                />
                <AdminStatCard
                    color="teal"
                    label="แบบสอบถาม"
                    value={totalSurveyAnswers}
                    subtitle="Survey Answers"
                    icon={
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    }
                />
            </div>

            {/* Quick info row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 col-span-1">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Actions
                    </h3>
                    <div className="space-y-2">
                        <Link
                            href="/admin/drafts/new"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            สร้างร่างกฎหมายใหม่
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ดูหน้าเว็บไซต์
                        </Link>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 col-span-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        ข้อมูลสรุป
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                            <p className="text-xs text-gray-500 mt-1">ผู้ใช้ทั้งหมด</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-2xl font-bold text-gray-800">
                                {drafts.reduce((acc, d) => acc + d._count.sections, 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">มาตราทั้งหมด</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-2xl font-bold text-gray-800">
                                {totalVotes > 0
                                    ? Math.round(
                                        (drafts.reduce(
                                            (acc, d) =>
                                                acc + d.sections.reduce((a, s) => a + s._count.votes, 0),
                                            0
                                        ) /
                                            Math.max(
                                                drafts.reduce((acc, d) => acc + d._count.sections, 0),
                                                1
                                            )) *
                                        10
                                    ) / 10
                                    : 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">โหวตเฉลี่ย/มาตรา</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drafts Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        ร่างกฎหมายทั้งหมด
                        <span className="text-xs text-gray-400 font-normal">
                            ({totalDrafts} รายการ)
                        </span>
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="text-left py-3 px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    ร่างกฎหมาย
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    หน่วยงาน
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    สถานะ
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    มาตรา
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    โหวต
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    ความเห็น
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    แบบสอบถาม
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {drafts.map((draft) => {
                                const draftVotes = draft.sections.reduce(
                                    (acc, s) => acc + s._count.votes,
                                    0
                                );
                                const draftComments = draft.sections.reduce(
                                    (acc, s) => acc + s._count.comments,
                                    0
                                );
                                const draftSurveyAnswers = draft.surveyQuestions.reduce(
                                    (acc, q) => acc + q._count.responses,
                                    0
                                );
                                return (
                                    <tr
                                        key={draft.id}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <td className="py-3.5 px-5">
                                            <Link
                                                href={`/admin/drafts/${draft.id}/edit`}
                                                className="font-medium text-gray-800 hover:text-[#1a3c7b] transition-colors line-clamp-1 group-hover:text-[#1a3c7b]"
                                            >
                                                {draft.title}
                                            </Link>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(draft.createdAt).toLocaleDateString("th-TH", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                <span className="h-5 w-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px]">
                                                    🏛️
                                                </span>
                                                {draft.agency}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <StatusBadge status={draft.status} />
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                                {draft._count.sections}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="text-xs font-semibold text-purple-600">
                                                {draftVotes}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="text-xs font-semibold text-rose-500">
                                                {draftComments}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="text-xs font-semibold text-teal-600">
                                                {draftSurveyAnswers}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link
                                                    href={`/admin/drafts/${draft.id}/edit`}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1a3c7b] hover:bg-blue-50 transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/admin/drafts/${draft.id}/edit?tab=responses`}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                                    title="ดูผู้ตอบแบบสอบถาม"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </Link>
                                                <DeleteDraftButton draftId={draft.id} title={draft.title} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {drafts.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">ยังไม่มีร่างกฎหมายในระบบ</p>
                        <p className="text-xs text-gray-400">
                            กดปุ่ม &quot;สร้างร่างใหม่&quot; เพื่อเริ่มต้น
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
