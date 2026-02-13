"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addComment(sectionId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
    }

    if (!content.trim()) {
        throw new Error("กรุณากรอกความคิดเห็น");
    }

    await prisma.comment.create({
        data: {
            content: content.trim(),
            userId: session.user.id,
            sectionId,
        },
    });

    revalidatePath("/drafts");
}

export async function deleteComment(commentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("กรุณาเข้าสู่ระบบก่อน");
    }

    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new Error("ไม่พบความคิดเห็นนี้");
    }

    // Only the comment owner or admin can delete
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (comment.userId !== session.user.id && user?.role !== "ADMIN") {
        throw new Error("ไม่มีสิทธิ์ลบความคิดเห็นนี้");
    }

    await prisma.comment.delete({
        where: { id: commentId },
    });

    revalidatePath("/drafts");
}
