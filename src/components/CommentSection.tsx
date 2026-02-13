"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addComment } from "@/actions/comment-actions";

type CommentListProps = {
    sectionId: string;
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        user: {
            name: string | null;
            image: string | null;
        };
    }[];
    isOpen: boolean;
};

export function CommentSection({
    sectionId,
    comments,
    isOpen,
}: CommentListProps) {
    const { data: session } = useSession();
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const [showAll, setShowAll] = useState(false);

    const displayComments = showAll ? comments : comments.slice(0, 3);

    const handleSubmit = () => {
        if (!content.trim()) return;
        startTransition(async () => {
            await addComment(sectionId, content);
            setContent("");
        });
    };

    return (
        <div className="space-y-3">
            {/* Comment form */}
            {session?.user && isOpen && (
                <div className="flex gap-2">
                    <Avatar className="h-7 w-7 mt-1 flex-shrink-0">
                        <AvatarImage
                            src={session.user.image || ""}
                            alt={session.user.name || ""}
                        />
                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">
                            {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <Textarea
                            placeholder="แสดงความคิดเห็นของท่าน..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[60px] text-sm resize-none"
                            rows={2}
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={isPending || !content.trim()}
                                size="sm"
                                className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                            >
                                {isPending ? "กำลังส่ง..." : "ส่งความเห็น"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Comment list */}
            {comments.length > 0 && (
                <div className="space-y-2.5">
                    <p className="text-xs font-medium text-muted-foreground">
                        ความคิดเห็น ({comments.length})
                    </p>
                    {displayComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                        >
                            <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage
                                    src={comment.user.image || ""}
                                    alt={comment.user.name || ""}
                                />
                                <AvatarFallback className="text-[9px] bg-gray-200">
                                    {comment.user.name?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">
                                        {comment.user.name || "ผู้ใช้"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/80 mt-0.5 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {comments.length > 3 && !showAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-muted-foreground h-7"
                            onClick={() => setShowAll(true)}
                        >
                            ดูเพิ่มเติม ({comments.length - 3} ความเห็น)
                        </Button>
                    )}
                </div>
            )}

            {comments.length === 0 && !session?.user && (
                <p className="text-xs text-center text-muted-foreground py-2">
                    ยังไม่มีความคิดเห็น
                </p>
            )}
        </div>
    );
}
