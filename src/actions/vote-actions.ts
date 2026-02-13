"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function castVote(sectionId: string, type: "AGREE" | "DISAGREE", sessionId: string) {
    const session = await auth();
    const userId = session?.user?.id || undefined;

    if (!sessionId || sessionId.length < 10) {
        throw new Error("Invalid session");
    }

    await prisma.vote.upsert({
        where: {
            sessionId_sectionId: {
                sessionId,
                sectionId,
            },
        },
        create: {
            userId,
            sessionId,
            sectionId,
            type,
        },
        update: {
            type,
        },
    });

    revalidatePath("/drafts");
}

export async function removeVote(sectionId: string, sessionId: string) {
    if (!sessionId || sessionId.length < 10) {
        throw new Error("Invalid session");
    }

    await prisma.vote.deleteMany({
        where: {
            sessionId,
            sectionId,
        },
    });

    revalidatePath("/drafts");
}
