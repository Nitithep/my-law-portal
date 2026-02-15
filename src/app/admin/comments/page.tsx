import { getAllComments } from "@/actions/comment-actions";
import AdminCommentList from "@/components/admin/AdminCommentList";
import { CommentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({
    searchParams,
}: {
    searchParams: { page?: string; status?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const status = searchParams.status as CommentStatus | undefined;

    const { comments, total, totalPages } = await getAllComments(page, 20, status);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">จัดการความคิดเห็น</h1>
                <p className="text-gray-500">ตรวจสอบและจัดการความคิดเห็นจากผู้ใช้งาน</p>
            </div>
            <AdminCommentList
                comments={comments as any[]}
                total={total}
                page={page}
                totalPages={totalPages}
                currentStatus={status}
            />
        </div>
    );
}
