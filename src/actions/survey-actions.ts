"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type SurveySubmission = {
    questionId: string;
    answer: "AGREE" | "DISAGREE";
    comment?: string;
};

async function verifyCaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        console.error("RECAPTCHA_SECRET_KEY not configured");
        return false;
    }

    try {
        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${token}`,
        });
        const data = await res.json();
        return data.success === true;
    } catch {
        console.error("CAPTCHA verification failed");
        return false;
    }
}

export async function submitSurvey(
    draftId: string,
    submissions: SurveySubmission[],
    sessionId: string,
    captchaToken: string
) {
    // Verify CAPTCHA
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
        return { success: false, error: "CAPTCHA verification failed" };
    }

    // Get userId if logged in (optional)
    const session = await auth();
    const userId = session?.user?.id || undefined;

    if (!sessionId || sessionId.length < 10) {
        return { success: false, error: "Invalid session" };
    }

    if (submissions.length === 0) {
        return { success: false, error: "กรุณาตอบอย่างน้อย 1 ข้อ" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            for (const sub of submissions) {
                // Check if this session already answered this question
                const existing = await tx.surveyResponse.findUnique({
                    where: {
                        sessionId_surveyQuestionId: {
                            sessionId,
                            surveyQuestionId: sub.questionId,
                        },
                    },
                });

                if (existing) {
                    await tx.surveyResponse.update({
                        where: { id: existing.id },
                        data: {
                            answer: sub.answer,
                            comment: sub.comment,
                        },
                    });
                } else {
                    await tx.surveyResponse.create({
                        data: {
                            userId,
                            sessionId,
                            surveyQuestionId: sub.questionId,
                            answer: sub.answer,
                            comment: sub.comment,
                        },
                    });
                }
            }
        });

        revalidatePath(`/drafts/${draftId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to submit survey:", error);
        return { success: false, error: "Failed to submit survey" };
    }
}
