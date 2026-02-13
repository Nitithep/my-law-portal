import { prisma } from "@/lib/db";

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <div className="flex items-center gap-3">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt=""
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {user.name?.charAt(0) || "?"}
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-800">
                                                {user.name || "ไม่ระบุชื่อ"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                                        {user.email}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${user.role === "ADMIN"
                                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                                }`}
                                        >
                                            {user.role === "ADMIN" ? "Admin" : "Citizen"}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="text-xs font-semibold text-purple-600">
                                            {user._count.votes}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="text-xs font-semibold text-rose-500">
                                            {user._count.comments}
                                        </span>
                                    </td>
                                </tr>
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
