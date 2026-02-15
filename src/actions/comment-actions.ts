"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CommentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("กรุณาเข้าสู่ระบบ");
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });
    if (user?.role !== Role.ADMIN) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง — เฉพาะผู้ดูแลระบบเท่านั้น");
    }
    return session.user.id;
}

export async function getAllComments(
    page: number = 1,
    limit: number = 20,
    status?: CommentStatus,
    lawDraftId?: string
) {
    await requireAdmin();
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (lawDraftId) {
        where.section = {
            lawDraftId: lawDraftId
        };
    }

    const [comments, total] = await Promise.all([
        prisma.comment.findMany({
            where,
            include: {
                user: { select: { name: true, image: true, email: true } },
                section: {
                    include: {
                        lawDraft: { select: { title: true, id: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.comment.count({ where }),
    ]);

    return { comments, total, totalPages: Math.ceil(total / limit) };
}

export async function updateCommentStatus(id: string, status: CommentStatus) {
    await requireAdmin();

    await prisma.comment.update({
        where: { id },
        data: { status },
    });

    revalidatePath("/admin/comments");
}

export async function addComment(sectionId: string, content: string, images: string[] = []) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("กรุณาเข้าสู่ระบบ");
    }

    await prisma.comment.create({
        data: {
            content,
            sectionId,
            userId: session.user.id,
            images,
        },
    });

    // Revalidate the draft page so the new comment appears
    const section = await prisma.lawSection.findUnique({
        where: { id: sectionId },
        select: { lawDraftId: true },
    });

    if (section) {
        revalidatePath(`/drafts/${section.lawDraftId}`);
    }
}
