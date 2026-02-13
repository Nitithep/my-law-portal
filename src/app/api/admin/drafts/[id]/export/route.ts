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
