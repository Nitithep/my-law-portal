"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    {
        label: "แดชบอร์ด",
        href: "/admin",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
        ),
        exact: true,
    },
    {
        label: "ร่างกฎหมาย",
        href: "/admin/drafts",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: "จัดการแบนเนอร์",
        href: "/admin/banners",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: "ผู้ใช้งาน",
        href: "/admin/users",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        label: "ความคิดเห็น",
        href: "/admin/comments",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
        ),
    },
    {
        label: "ตั้งค่า",
        href: "/admin/settings",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (item: (typeof navItems)[0]) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-[#f0f2f5]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 lg:top-0 left-0 z-50 lg:z-auto h-screen lg:h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Sidebar header */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
                    <div className="h-9 w-9 rounded-xl bg-[#1a3c7b] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 3L3 7v2h18V7L12 3z" />
                            <path d="M5 9v8h2V9M10 9v8h2V9M17 9v8h2V9" />
                            <path d="M3 17h18v2H3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1a3c7b]">Admin Panel</p>
                        <p className="text-[10px] text-gray-400">ระบบจัดการหลังบ้าน</p>
                    </div>
                    {/* Mobile close */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
                                    ? "bg-[#1a3c7b] text-white shadow-md shadow-[#1a3c7b]/20"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <span className={active ? "text-white" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar footer */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับหน้าหลัก
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <div className="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Breadcrumb */}
                    <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500">
                        <Link href="/admin" className="hover:text-[#1a3c7b] transition-colors">
                            Admin
                        </Link>
                        {pathname !== "/admin" && (
                            <>
                                <span>/</span>
                                <span className="text-gray-800 font-medium">
                                    {pathname.includes("/drafts/new")
                                        ? "สร้างร่างใหม่"
                                        : pathname.includes("/edit")
                                            ? "แก้ไขร่าง"
                                            : pathname.includes("/drafts")
                                                ? "ร่างกฎหมาย"
                                                : pathname.includes("/users")
                                                    ? "ผู้ใช้งาน"
                                                    : pathname.includes("/settings")
                                                        ? "ตั้งค่า"
                                                        : ""}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/drafts/new"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1a3c7b] text-white text-xs font-semibold rounded-lg hover:bg-[#15325f] transition-colors shadow-sm"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            สร้างร่างใหม่
                        </Link>
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-1 p-4 lg:p-6">{children}</div>
            </div>
        </div>
    );
}
