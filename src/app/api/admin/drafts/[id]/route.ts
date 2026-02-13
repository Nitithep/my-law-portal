import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin access
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const draft = await prisma.lawDraft.findUnique({
        where: { id },
        include: {
            sections: {
                orderBy: { sectionNo: "asc" },
                include: {
                    _count: {
                        select: { votes: true, comments: true },
                    },
                },
            },
            surveyQuestions: {
                orderBy: { order: "asc" },
                include: {
                    _count: {
                        select: { responses: true },
                    },
                },
            },
        },
    });

    if (!draft) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...draft,
        startDate: draft.startDate.toISOString(),
        endDate: draft.endDate.toISOString(),
    });
}
