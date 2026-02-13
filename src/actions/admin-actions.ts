"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

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

export async function createLawDraft(data: {
    title: string;
    description: string;
    agency: string;
    startDate: string;
    endDate: string;
    category: string;
    draftType: string;
    image: string;
    affectedParties: string;
    hearingTime: string;
    hearingRound: number;
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
            draftType: data.draftType,
            image: data.image || null,
            affectedParties: data.affectedParties,
            hearingTime: data.hearingTime,
            hearingRound: data.hearingRound,
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

export async function updateSection(
    sectionId: string,
    content: string
) {
    await requireAdmin();

    const section = await prisma.lawSection.update({
        where: { id: sectionId },
        data: { content },
        select: { lawDraftId: true },
    });

    revalidatePath(`/drafts/${section.lawDraftId}`);
    revalidatePath("/admin");
}

export async function addSurveyQuestion(
    draftId: string,
    data: { question: string; order: number }
) {
    await requireAdmin();

    await prisma.surveyQuestion.create({
        data: {
            lawDraftId: draftId,
            question: data.question,
            order: data.order,
        },
    });

    revalidatePath(`/drafts/${draftId}`);
    revalidatePath("/admin");
}

export async function updateSurveyQuestion(
    questionId: string,
    data: { question: string; order: number }
) {
    await requireAdmin();

    const question = await prisma.surveyQuestion.update({
        where: { id: questionId },
        data: {
            question: data.question,
            order: data.order,
        },
        select: { lawDraftId: true },
    });

    revalidatePath(`/drafts/${question.lawDraftId}`);
    revalidatePath("/admin");
}

export async function deleteSurveyQuestion(questionId: string) {
    await requireAdmin();

    const question = await prisma.surveyQuestion.findUnique({
        where: { id: questionId },
        select: { lawDraftId: true },
    });

    await prisma.surveyQuestion.delete({
        where: { id: questionId },
    });

    if (question) {
        revalidatePath(`/drafts/${question.lawDraftId}`);
    }
    revalidatePath("/admin");
}

export async function updateUserRole(userId: string, role: Role) {
    const session = await auth();
    // Safety check: ensure user is admin
    const requester = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true },
    });
    if (requester?.role !== Role.ADMIN) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง");
    }

    if (session?.user?.id === userId) {
        throw new Error("ไม่สามารถเปลี่ยนบทบาทของตัวเองได้");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath("/admin");
}


export async function deleteUser(userId: string) {
    const session = await auth();
    // Check if requester is admin
    const requester = await prisma.user.findUnique({
        where: { id: session?.user?.id },
        select: { role: true },
    });
    if (requester?.role !== Role.ADMIN) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง");
    }

    if (session?.user?.id === userId) {
        throw new Error("ไม่สามารถลบบัญชีตัวเองได้");
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    revalidatePath("/admin");
}

export type SurveyResponseResult = {
    sessionId: string;
    createdAt: Date;
    responseCount: number;
    userId?: string;
    userName?: string;
    answers: {
        questionId: string;
        question: string;
        answer: string;
        comment: string | null;
        order: number;
    }[];
};

export async function getSurveyResponses(draftId: string): Promise<SurveyResponseResult[]> {
    await requireAdmin();

    const responses = await prisma.surveyResponse.findMany({
        where: {
            surveyQuestion: {
                lawDraftId: draftId,
            },
        },
        include: {
            user: {
                select: { name: true, email: true },
            },
            surveyQuestion: {
                select: { id: true, question: true, order: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Group by sessionId
    const grouped = responses.reduce((acc, curr) => {
        const { sessionId } = curr;
        if (!acc[sessionId]) {
            acc[sessionId] = {
                sessionId,
                createdAt: curr.createdAt,
                responseCount: 0,
                userId: curr.userId || undefined,
                userName: curr.user?.name || curr.user?.email || "ผู้ใช้งานทั่วไป",
                answers: [],
            };
        }

        acc[sessionId].answers.push({
            questionId: curr.surveyQuestionId,
            question: curr.surveyQuestion.question,
            answer: curr.answer,
            comment: curr.comment,
            order: curr.surveyQuestion.order,
        });
        acc[sessionId].responseCount++;

        // Keep the latest date
        if (curr.createdAt > acc[sessionId].createdAt) {
            acc[sessionId].createdAt = curr.createdAt;
        }

        return acc;
    }, {} as Record<string, SurveyResponseResult>);

    return Object.values(grouped).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export type AdminCommentResult = {
    id: string;
    content: string;
    images: string[];
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    section: {
        sectionNo: string;
    };
};

export async function getDraftComments(draftId: string): Promise<AdminCommentResult[]> {
    await requireAdmin();

    const comments = await prisma.comment.findMany({
        where: {
            section: {
                lawDraftId: draftId,
            },
        },
        include: {
            user: {
                select: { name: true, email: true, image: true },
            },
            section: {
                select: { sectionNo: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return comments.map(c => ({
        id: c.id,
        content: c.content,
        // @ts-ignore
        images: c.images || [],
        createdAt: c.createdAt,
        user: c.user,
        section: c.section,
    }));
}

export async function deleteAdminComment(commentId: string) {
    await requireAdmin();
    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath("/admin");
}
