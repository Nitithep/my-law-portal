"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, deleteUser } from "@/actions/admin-actions";
import { Role } from "@prisma/client";

type UserProps = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: "ADMIN" | "CITIZEN";
    _count: {
        votes: number;
        comments: number;
    };
};

export function UserRow({ user }: { user: UserProps }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [role, setRole] = useState(user.role);

    const handleRoleChange = async (newRole: "ADMIN" | "CITIZEN") => {
        if (newRole === user.role) return;
        if (!confirm(`คุณต้องการเปลี่ยนบทบาทของ ${user.name || user.email} เป็น ${newRole} ใช่หรือไม่?`)) {
            setRole(user.role); // Reset
            return;
        }

        setIsPending(true);
        try {
            // @ts-ignore - Prisma enum issue in client component
            await updateUserRole(user.id, newRole);
            setRole(newRole);
        } catch (error: any) {
            alert(error.message || "เกิดข้อผิดพลาดในการเปลี่ยนบทบาท");
            setRole(user.role); // Reset on error
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ ${user.name || user.email}? ข้อมูลทั้งหมดจะถูกลบถาวร`)) return;

        setIsPending(true);
        try {
            await deleteUser(user.id);
            router.refresh();
        } catch (error: any) {
            alert(error.message || "เกิดข้อผิดพลาดในการลบผู้ใช้");
            setIsPending(false);
        }
    };

    return (
        <tr className="hover:bg-blue-50/30 transition-colors group">
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
                    <div>
                        <div className="font-medium text-gray-800">
                            {user.name || "ไม่ระบุชื่อ"}
                        </div>
                        {/* Mobile email view could go here */}
                    </div>
                </div>
            </td>
            <td className="py-3.5 px-4 text-gray-500 text-xs">
                {user.email}
            </td>
            <td className="py-3.5 px-4 text-center">
                <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as "ADMIN" | "CITIZEN")}
                    disabled={isPending}
                    className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 border outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${role === "ADMIN"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                >
                    <option value="CITIZEN">Citizen</option>
                    <option value="ADMIN">Admin</option>
                </select>
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
            <td className="py-3.5 px-4 text-center">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="ลบผู้ใช้"
                >
                    {isPending ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                </button>
            </td>
        </tr>
    );
}
