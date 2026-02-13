"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
    if (user?.role !== "ADMIN") {
        throw new Error("ไม่มีสิทธิ์เข้าถึง — เฉพาะผู้ดูแลระบบเท่านั้น");
    }
    return session.user.id;
}

export async function createLawDraft(data: {
    title: string;
    description: string;
    agency: string;
    startDate: string;
    endDate: string;
    category: string;
    image: string;
    affectedParties: string;
    hearingTime: string;
    projectDetails?: string;
    version?: number;
    hearingSummary?: string;
    sections: { sectionNo: string; content: string }[];
    surveyQuestions: { question: string; order: number }[];
    attachments?: { fileName: string; fileUrl: string }[];
}) {
    await requireAdmin();

    const draft = await prisma.lawDraft.create({
        data: {
            title: data.title,
            description: data.description,
            agency: data.agency,
            category: data.category,
            image: data.image || null,
            affectedParties: data.affectedParties,
            hearingTime: data.hearingTime,
            projectDetails: data.projectDetails || null,
            version: data.version || 1,
            hearingSummary: data.hearingSummary || null,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            sections: {
                create: data.sections.map((s) => ({
                    sectionNo: s.sectionNo,
                    content: s.content,
                })),
            },
            surveyQuestions: {
                create: data.surveyQuestions.map((q) => ({
                    question: q.question,
                    order: q.order,
                })),
            },
            attachments: data.attachments
                ? {
                    create: data.attachments.map((a) => ({
                        fileName: a.fileName,
                        fileUrl: a.fileUrl,
                    })),
                }
                : undefined,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return draft;
}

export async function updateLawDraft(
    id: string,
    data: {
        title?: string;
        description?: string;
        agency?: string;
        status?: "OPEN" | "CLOSED";
        category?: string;
        image?: string;
        affectedParties?: string;
        hearingTime?: string;
        startDate?: string;
        endDate?: string;
        projectDetails?: string;
        version?: number;
        hearingSummary?: string;
        hearingSummaryPublished?: boolean;
    }
) {
    await requireAdmin();

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.agency !== undefined) updateData.agency = data.agency;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.affectedParties !== undefined) updateData.affectedParties = data.affectedParties;
    if (data.hearingTime !== undefined) updateData.hearingTime = data.hearingTime;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.projectDetails !== undefined) updateData.projectDetails = data.projectDetails;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.hearingSummary !== undefined) updateData.hearingSummary = data.hearingSummary;
    if (data.hearingSummaryPublished !== undefined) updateData.hearingSummaryPublished = data.hearingSummaryPublished;

    await prisma.lawDraft.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/drafts/${id}`);
}

export async function deleteLawDraft(id: string) {
    await requireAdmin();

    await prisma.lawDraft.delete({
        where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");
}

export async function addSection(
    draftId: string,
    data: { sectionNo: string; content: string }
) {
    await requireAdmin();

    await prisma.lawSection.create({
        data: {
            lawDraftId: draftId,
            sectionNo: data.sectionNo,
            content: data.content,
        },
    });

    revalidatePath(`/drafts/${draftId}`);
    revalidatePath("/admin");
}

export async function deleteSection(sectionId: string) {
    await requireAdmin();

    const section = await prisma.lawSection.findUnique({
        where: { id: sectionId },
        select: { lawDraftId: true },
    });

    await prisma.lawSection.delete({
        where: { id: sectionId },
    });

    if (section) {
        revalidatePath(`/drafts/${section.lawDraftId}`);
    }
    revalidatePath("/admin");
}

export async function addAttachment(
    draftId: string,
    data: { fileName: string; fileUrl: string }
) {
    await requireAdmin();

    await prisma.draftAttachment.create({
        data: {
            lawDraftId: draftId,
            fileName: data.fileName,
            fileUrl: data.fileUrl,
        },
    });

    revalidatePath(`/drafts/${draftId}`);
    revalidatePath("/admin");
}

export async function deleteAttachment(attachmentId: string) {
    await requireAdmin();

    const attachment = await prisma.draftAttachment.findUnique({
        where: { id: attachmentId },
        select: { lawDraftId: true },
    });

    await prisma.draftAttachment.delete({
        where: { id: attachmentId },
    });

    if (attachment) {
        revalidatePath(`/drafts/${attachment.lawDraftId}`);
    }
    revalidatePath("/admin");
}
