import { prisma } from "@/lib/db";
import { UserRow } from "@/components/admin/UserRow";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { votes: true, comments: true },
            },
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-gray-800">ผู้ใช้งาน</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    ข้อมูลผู้ใช้งานในระบบ ({users.length} คน)
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="text-left py-3 px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    ผู้ใช้
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    อีเมล
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    บทบาท
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    โหวต
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    ความเห็น
                                </th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                // @ts-ignore - Prisma enum vs string literal mismatch
                                <UserRow key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="py-16 text-center text-gray-500">
                        ยังไม่มีผู้ใช้ในระบบ
                    </div>
                )}
            </div>
        </div>
    );
}
