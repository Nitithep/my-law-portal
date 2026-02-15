"use client";

import { useEffect, useState } from "react";
import AdminCommentList from "./AdminCommentList";
import { getAllComments } from "@/actions/comment-actions";
import { CommentStatus } from "@prisma/client";

export default function DraftCommentManager({ draftId }: { draftId: string }) {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<CommentStatus | undefined>(undefined);
    const [data, setData] = useState<{
        comments: any[];
        total: number;
        totalPages: number;
    }>({ comments: [], total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAllComments(page, 10, status, draftId);
                setData(res);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, status, draftId]);

    return (
        <div className="space-y-4">
            {loading && <div className="text-center py-4 text-gray-500 text-sm">กำลังโหลดความคิดเห็น...</div>}
            <AdminCommentList
                comments={data.comments}
                total={data.total}
                page={page}
                totalPages={data.totalPages}
                currentStatus={status}
                onPageChange={setPage}
                onStatusChange={setStatus}
                disableRouting={true}
            />
        </div>
    );
}
