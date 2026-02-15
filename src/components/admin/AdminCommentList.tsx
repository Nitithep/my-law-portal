"use client";

import { useState } from "react";
import { updateCommentStatus } from "@/actions/comment-actions";
import { analyzeSentiment } from "@/actions/ai-actions";
import { CommentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

// Define the type based on the return from getAllComments
type CommentWithRelations = {
    id: string;
    content: string;
    createdAt: Date;
    status: CommentStatus;
    user: {
        name: string | null;
        image: string | null;
        email: string;
    };
    section: {
        lawDraft: {
            title: string;
            id: string;
        };
    };
};

export default function AdminCommentList({
    comments,
    total,
    page,
    totalPages,
    currentStatus,
    onPageChange,
    onStatusChange,
    disableRouting = false,
}: {
    comments: CommentWithRelations[];
    total: number;
    page: number;
    totalPages: number;
    currentStatus?: CommentStatus;
    onPageChange?: (page: number) => void;
    onStatusChange?: (status: CommentStatus | undefined) => void;
    disableRouting?: boolean;
}) {
    const router = useRouter();
    const [isPending, setIsPending] = useState<string | null>(null);
    const [sentimentMap, setSentimentMap] = useState<Record<string, string>>({});
    const [analyzing, setAnalyzing] = useState<string | null>(null);

    const handleSentimentCheck = async (id: string, text: string) => {
        setAnalyzing(id);
        try {
            const result = await analyzeSentiment(text);
            setSentimentMap(prev => ({ ...prev, [id]: result }));
        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(null);
        }
    };

    const handleStatusChange = async (id: string, status: CommentStatus) => {
        setIsPending(id);
        try {
            await updateCommentStatus(id, status);
            router.refresh();
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsPending(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => disableRouting && onStatusChange ? onStatusChange(undefined) : router.push(disableRouting ? "#" : `/admin/comments`)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!currentStatus
                        ? "bg-[#1a3c7b] text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    ทั้งหมด
                </button>
                <button
                    onClick={() => disableRouting && onStatusChange ? onStatusChange(CommentStatus.APPROVED) : router.push(disableRouting ? "#" : `/admin/comments?status=APPROVED`)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentStatus === "APPROVED"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    อนุมัติแล้ว
                </button>
                <button
                    onClick={() => disableRouting && onStatusChange ? onStatusChange(CommentStatus.HIDDEN) : router.push(disableRouting ? "#" : `/admin/comments?status=HIDDEN`)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentStatus === "HIDDEN"
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    ซ่อนอยู่
                </button>
                <button
                    onClick={() => disableRouting && onStatusChange ? onStatusChange(CommentStatus.FLAGGED) : router.push(disableRouting ? "#" : `/admin/comments?status=FLAGGED`)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentStatus === "FLAGGED"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    โดนรายงาน
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">ผู้ใช้งาน</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">ความคิดเห็น</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">กฎหมาย</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">สถานะ</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
                                    ไม่พบความคิดเห็น
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {comment.user.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={comment.user.image}
                                                    alt={comment.user.name || ""}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    ?
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{comment.user.name}</div>
                                                <div className="text-xs text-gray-500">{comment.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-800 line-clamp-2 max-w-sm" title={comment.content}>
                                            {comment.content}
                                        </p>
                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                            <span>
                                                {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            <span className="text-gray-300">|</span>

                                            {sentimentMap[comment.id] ? (
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${sentimentMap[comment.id] === "POSITIVE" ? "bg-green-100 text-green-700" :
                                                    sentimentMap[comment.id] === "NEGATIVE" ? "bg-red-100 text-red-700" :
                                                        "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {sentimentMap[comment.id] === "POSITIVE" && "😊 "}
                                                    {sentimentMap[comment.id] === "NEGATIVE" && "😠 "}
                                                    {sentimentMap[comment.id] === "NEUTRAL" && "😐 "}
                                                    {sentimentMap[comment.id]}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSentimentCheck(comment.id, comment.content)}
                                                    disabled={analyzing === comment.id}
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium transition-colors border border-indigo-200"
                                                >
                                                    {analyzing === comment.id ? (
                                                        <>
                                                            <svg className="animate-spin h-3 w-3 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span>กำลังวิเคราะห์...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>🤖</span>
                                                            <span>วิเคราะห์อารมณ์</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-[#1a3c7b] bg-blue-50 px-2 py-1 rounded inline-block">
                                            {comment.section.lawDraft.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${comment.status === "APPROVED"
                                                ? "bg-green-100 text-green-800"
                                                : comment.status === "HIDDEN"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {comment.status === "APPROVED" ? "ปกติ" : comment.status === "HIDDEN" ? "ซ่อน" : "รายงาน"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {comment.status !== "APPROVED" && (
                                                <button
                                                    onClick={() => handleStatusChange(comment.id, "APPROVED")}
                                                    disabled={isPending === comment.id}
                                                    className="text-green-600 hover:text-green-800 text-xs font-medium bg-green-50 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                                                >
                                                    อนุมัติ
                                                </button>
                                            )}
                                            {comment.status !== "HIDDEN" && (
                                                <button
                                                    onClick={() => handleStatusChange(comment.id, "HIDDEN")}
                                                    disabled={isPending === comment.id}
                                                    className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                                >
                                                    ซ่อน
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple) */}
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>ทั้งหมด {total} รายการ</div>
                <div className="flex gap-2">
                    <button
                        onClick={() => disableRouting && onPageChange ? onPageChange(page - 1) : router.push(`/admin/comments?page=${page - 1}${currentStatus ? `&status=${currentStatus}` : ""}`)}
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        ก่อนหน้า
                    </button>
                    <span className="px-2 py-1">หน้า {page} / {Math.max(1, totalPages)}</span>
                    <button
                        onClick={() => disableRouting && onPageChange ? onPageChange(page + 1) : router.push(`/admin/comments?page=${page + 1}${currentStatus ? `&status=${currentStatus}` : ""}`)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
}
