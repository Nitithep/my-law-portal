import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }


    const { id } = await params;
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (type === "survey") {
        // Fetch survey data
        const draft = await prisma.lawDraft.findUnique({
            where: { id },
            include: {
                surveyQuestions: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!draft) return new NextResponse("Not Found", { status: 404 });

        // Fetch all responses for these questions
        const questionIds = draft.surveyQuestions.map(q => q.id);
        const responses = await prisma.surveyResponse.findMany({
            where: {
                surveyQuestionId: { in: questionIds },
            },
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Group by Session ID to make rows
        const sessions = new Map<string, any>();

        responses.forEach(r => {
            const key = r.userId || r.sessionId;
            if (!sessions.has(key)) {
                sessions.set(key, {
                    id: key,
                    user: r.user,
                    date: r.createdAt,
                    answers: new Map<string, { answer: string; comment: string | null }>(),
                });
            }
            const session = sessions.get(key);
            session.answers.set(r.surveyQuestionId, {
                answer: r.answer,
                comment: r.comment,
            });
            // Update date to latest if needed, but usually first is fine
        });

        // Generate CSV
        // Header: Date, User/Session, [Question 1], [Question 1 Comment], [Question 2], ...
        const header = ["Date", "Respondent"];
        draft.surveyQuestions.forEach(q => {
            header.push(`"${q.question.replace(/"/g, '""')}"`);
            header.push("Comment");
        });

        const rows = [header.join(",")];

        sessions.forEach(session => {
            const row = [
                session.date.toISOString(),
                session.user ? `"${session.user.name || session.user.email}"` : `"${session.id}"`,
            ];

            draft.surveyQuestions.forEach(q => {
                const ans = session.answers.get(q.id);
                if (ans) {
                    row.push(`"${ans.answer.replace(/"/g, '""')}"`);
                    row.push(ans.comment ? `"${ans.comment.replace(/"/g, '""')}"` : "");
                } else {
                    row.push("");
                    row.push("");
                }
            });
            rows.push(row.join(","));
        });

        const csvContent = "\uFEFF" + rows.join("\n");
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="survey-responses-${id}.csv"`,
            },
        });
    }

    // Default: Section Export
    const draft = await prisma.lawDraft.findUnique({
        where: { id },
        include: {
            sections: {
                include: {
                    votes: true,
                    comments: {
                        include: { user: true },
                    },
                },
                orderBy: { sectionNo: "asc" },
            },
        },
    });

    if (!draft) {
        return new NextResponse("Not Found", { status: 404 });
    }

    // Generate CSV
    const rows = [
        ["Section No", "Content", "Agree Votes", "Disagree Votes", "Comments"],
    ];

    draft.sections.forEach((section) => {
        const agree = section.votes.filter((v) => v.type === "AGREE").length;
        const disagree = section.votes.filter((v) => v.type === "DISAGREE").length;

        // Escape CSV fields
        const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;

        // Combine comments into a single cell for this row, or add multiple rows?
        // Simpler: Just summary stats in main row
        rows.push([
            escape(section.sectionNo),
            escape(section.content),
            agree.toString(),
            disagree.toString(),
            escape(section.comments.map(c => `${c.user.name}: ${c.content}`).join("\n"))
        ]);
    });

    const csvContent = "\uFEFF" + rows.map((e) => e.join(",")).join("\n"); // Add BOM for Excel

    return new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="draft-${id}-export.csv"`,
        },
    });
}
