"use client";

import { useState } from "react";
import { deleteLawDraft } from "@/actions/admin-actions";

export function DeleteDraftButton({
    draftId,
    title,
}: {
    draftId: string;
    title: string;
}) {
    const [isPending, setIsPending] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            await deleteLawDraft(draftId);
            setShowModal(false);
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการลบ");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="ลบ"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {/* Delete Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !isPending && setShowModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                        {/* Icon */}
                        <div className="pt-6 pb-2 flex justify-center">
                            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4 text-center">
                            <h3 className="text-base font-bold text-gray-800 mb-2">
                                ยืนยันการลบ
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                ต้องการลบ <span className="font-semibold text-gray-700">&quot;{title}&quot;</span> หรือไม่?
                            </p>
                            <p className="text-xs text-red-400 mt-2">
                                การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลมาตรา โหวต และความเห็นทั้งหมดจะถูกลบ
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isPending}
                                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        กำลังลบ...
                                    </span>
                                ) : (
                                    "ลบร่างกฎหมาย"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
