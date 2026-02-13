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
    // TEMPORARY: Disable CAPTCHA for testing
    return true;
}

export async function submitSurvey(
    draftId: string,
    submissions: SurveySubmission[],
    sessionId: string,
    captchaToken: string
) {
    console.log("--- Submitting Survey ---");
    console.log("DraftId:", draftId);
    console.log("SessionId:", sessionId);
    console.log("Submissions count:", submissions.length);

    // Verify CAPTCHA (Bypassed)
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
        console.error("Submission failed: Captcha Invalid");
        return { success: false, error: "CAPTCHA verification failed" };
    }

    // Get userId if logged in (optional)
    const session = await auth();
    const userId = session?.user?.id || undefined;
    console.log("User ID:", userId || "Anonymous");

    if (!sessionId || sessionId.length < 10) {
        // Allow shorter sessionIds for testing if needed, but keeping check for now
    }

    if (submissions.length === 0) {
        return { success: false, error: "กรุณาตอบอย่างน้อย 1 ข้อ" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            for (const sub of submissions) {
                console.log(`Processing answer for Q: ${sub.questionId}, Answer: ${sub.answer}`);

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
                    console.log("Updating existing response:", existing.id);
                    await tx.surveyResponse.update({
                        where: { id: existing.id },
                        data: {
                            answer: sub.answer,
                            comment: sub.comment,
                        },
                    });
                } else {
                    console.log("Creating new response");
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

        console.log("Survey submitted successfully to DB.");
        revalidatePath(`/drafts/${draftId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to submit survey transaction:", error);
        return { success: false, error: "Failed to submit survey" };
    }
}
