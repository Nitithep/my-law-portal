"use client";

import { useState, useEffect } from "react";
import { AdminCommentResult, getDraftComments, deleteAdminComment } from "@/actions/admin-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminCommentList({ draftId }: { draftId: string }) {
    const [comments, setComments] = useState<AdminCommentResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [draftId]);

    async function loadComments() {
        setLoading(true);
        try {
            const data = await getDraftComments(draftId);
            setComments(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าจะลบความคิดเห็นนี้?")) return;
        try {
            await deleteAdminComment(id);
            await loadComments();
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการลบ");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">กำลังโหลดความคิดเห็น...</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4">
                ความคิดเห็นทั้งหมด ({comments.length})
            </h3>

            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.user.image || ""} />
                                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xs">
                                        {comment.user.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {comment.user.name || comment.user.email || "ผู้ใช้งาน"}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                                            มาตรา {comment.section.sectionNo}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            • {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>

                                    {/* Images */}
                                    {comment.images && comment.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {comment.images.map((img, idx) => (
                                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={img} alt="comment attachment" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(comment.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                title="ลบความคิดเห็น"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 text-sm">ยังไม่มีความคิดเห็นในร่างกฎหมายนี้</p>
                    </div>
                )}
            </div>
        </div>
    );
}
