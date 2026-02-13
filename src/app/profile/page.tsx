import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    const { user } = session;

    // Fetch user history
    const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            votes: {
                include: {
                    section: {
                        include: {
                            lawDraft: true,
                        },
                    },
                },
                orderBy: {
                    section: {
                        lawDraft: {
                            createdAt: "desc",
                        },
                    },
                },
            },
            comments: {
                include: {
                    section: {
                        include: {
                            lawDraft: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!userData) {
        return <div>ไม่พบข้อมูลผู้ใช้</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="text-2xl bg-[#1a3c7b] text-white">
                        {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                        {user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ประชาชนทั่วไป"}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="history" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="history">ประวัติการลงคะแนน</TabsTrigger>
                    <TabsTrigger value="comments">ความเห็นของฉัน</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                🗳️ ประวัติการลงคะแนน ({userData.votes.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {userData.votes.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    ยังไม่มีประวัติการลงคะแนน
                                </p>
                            ) : (
                                userData.votes.map((vote) => (
                                    <div
                                        key={vote.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <Link
                                                href={`/drafts/${vote.section.lawDraftId}`}
                                                className="text-sm font-semibold text-[#1a3c7b] hover:underline block"
                                            >
                                                {vote.section.lawDraft.title}
                                            </Link>
                                            <p className="text-xs text-gray-600">
                                                มาตรา {vote.section.sectionNo}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold text-center sm:text-right shrink-0 ${vote.type === "AGREE"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-rose-100 text-rose-700"
                                            }`}>
                                            {vote.type === "AGREE" ? "👍 เห็นด้วย" : "👎 ไม่เห็นด้วย"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                💬 ความคิดเห็นของฉัน ({userData.comments.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {userData.comments.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    ยังไม่มีความคิดเห็น
                                </p>
                            ) : (
                                userData.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors space-y-3"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <Link
                                                    href={`/drafts/${comment.section.lawDraftId}`}
                                                    className="text-sm font-semibold text-[#1a3c7b] hover:underline"
                                                >
                                                    {comment.section.lawDraft.title}
                                                </Link>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        มาตรา {comment.section.sectionNo}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100/50">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
