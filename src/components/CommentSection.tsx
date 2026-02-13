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
        images?: string[];
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
    const [images, setImages] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [showAll, setShowAll] = useState(false);

    const displayComments = showAll ? comments : comments.slice(0, 3);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!content.trim() && images.length === 0) return;
        startTransition(async () => {
            // @ts-ignore
            await addComment(sectionId, content, images);
            setContent("");
            setImages([]);
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

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                        >
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div>
                                <input
                                    type="file"
                                    id={`file-${sectionId}`}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor={`file-${sectionId}`}
                                    className="cursor-pointer text-gray-400 hover:text-[#1a3c7b] transition-colors inline-flex items-center gap-1 text-xs"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="md:inline hidden">แนบรูปภาพ</span>
                                </label>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isPending || (!content.trim() && images.length === 0)}
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
                                {comment.images && comment.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {comment.images.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt="comment image" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
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
