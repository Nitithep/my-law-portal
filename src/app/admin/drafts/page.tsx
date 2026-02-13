import { prisma } from "@/lib/db";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteDraftButton } from "@/components/admin/DeleteDraftButton";

export default async function AdminDraftsPage() {
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
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">ร่างกฎหมายทั้งหมด</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        จัดการร่างกฎหมายในระบบรับฟังความคิดเห็น
                    </p>
                </div>
                <Link
                    href="/admin/drafts/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1a3c7b] text-white text-sm font-semibold rounded-xl hover:bg-[#15325f] transition-colors shadow-sm"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    สร้างร่างใหม่
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                                    ระยะเวลา
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {drafts.map((draft) => {
                                const draftVotes = draft.sections.reduce(
                                    (acc, s) => acc + s._count.votes, 0
                                );
                                const draftComments = draft.sections.reduce(
                                    (acc, s) => acc + s._count.comments, 0
                                );
                                return (
                                    <tr key={draft.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="py-3.5 px-5">
                                            <Link
                                                href={`/admin/drafts/${draft.id}/edit`}
                                                className="font-medium text-gray-800 hover:text-[#1a3c7b] transition-colors line-clamp-1 group-hover:text-[#1a3c7b]"
                                            >
                                                {draft.title}
                                            </Link>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                สร้างเมื่อ {new Date(draft.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                <span className="h-5 w-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px]">🏛️</span>
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
                                            <span className="text-xs font-semibold text-purple-600">{draftVotes}</span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="text-xs font-semibold text-rose-500">{draftComments}</span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="text-[10px] text-gray-400">
                                                <p>{new Date(draft.startDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</p>
                                                <p>- {new Date(draft.endDate).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}</p>
                                            </div>
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
                        <Link href="/admin/drafts/new" className="text-xs text-[#1a3c7b] hover:underline">
                            สร้างร่างใหม่
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
