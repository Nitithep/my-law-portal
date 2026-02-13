import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VoteButtons } from "@/components/VoteButtons";
import { CommentSection } from "@/components/CommentSection";

type SectionCardProps = {
    section: {
        id: string;
        sectionNo: string;
        content: string;
        votes: { type: "AGREE" | "DISAGREE" }[];
        comments: {
            id: string;
            content: string;
            createdAt: Date;
            user: { name: string | null; image: string | null };
        }[];
    };
    isOpen: boolean;
};

export function SectionCard({ section, isOpen }: SectionCardProps) {
    const agreeCount = section.votes.filter((v) => v.type === "AGREE").length;
    const disagreeCount = section.votes.filter(
        (v) => v.type === "DISAGREE"
    ).length;

    return (
        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-md bg-gradient-to-br from-blue-100 to-indigo-100 px-2.5 text-xs font-bold text-blue-700 border border-blue-200/50">
                        {section.sectionNo}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Content */}
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {section.content}
                    </p>
                </div>

                {/* Voting */}
                <VoteButtons
                    sectionId={section.id}
                    agreeCount={agreeCount}
                    disagreeCount={disagreeCount}
                    isOpen={isOpen}
                />

                <Separator className="my-2" />

                {/* Comments */}
                <CommentSection
                    sectionId={section.id}
                    comments={section.comments}
                    isOpen={isOpen}
                />
            </CardContent>
        </Card>
    );
}
