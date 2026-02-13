"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm font-sans">
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#1a3c7b] via-[#2b5ea7] to-[#4a90d9]" />

            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Left: Logo + Hamburger + Nav */}
                <div className="flex items-center gap-6">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex flex-col items-center">
                            {/* Dot Grid Logo */}
                            <div className="grid grid-cols-4 gap-0.5 mb-0.5">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className={`h-1 w-1 rounded-full ${i % 2 === 0 ? "bg-[#1a3c7b]" : "bg-[#4a90d9]"}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#1a3c7b] tracking-tighter leading-none">
                                LAW
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium tracking-wide leading-none">
                                www.law.go.th
                            </span>
                        </div>
                    </Link>

                    {/* Hamburger (Desktop) */}
                    <button className="hidden md:flex p-2 text-[#1a3c7b] hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Navigation Buttons (Desktop) */}
                    <nav className="hidden md:flex items-center gap-3">
                        <Link
                            href="/"
                            className="px-5 py-2 text-sm font-bold text-white bg-[#2b9e76] rounded hover:bg-[#249068] transition-colors shadow-sm"
                        >
                            โครงการรับฟัง
                        </Link>
                        <Link
                            href="/#drafts"
                            className="relative px-5 py-2 text-sm font-bold text-white bg-[#1a3c7b] rounded hover:bg-[#15325f] transition-colors shadow-sm flex items-center gap-2"
                        >
                            ฐานข้อมูลกฎหมาย
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shadow-sm border border-white">
                                BETA
                            </span>
                        </Link>
                        {session?.user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-sm font-bold text-white bg-[#d94a4a] rounded hover:bg-[#c73e3e] transition-colors shadow-sm"
                            >
                                🛡️ จัดการระบบ
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Language */}
                    <button className="hidden sm:flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:border-[#1a3c7b] hover:text-[#1a3c7b] transition-colors">
                        EN
                    </button>

                    {/* Favorites */}
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>

                    {/* Feedback/Chat */}
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1a3c7b] hover:bg-blue-50 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </button>

                    {/* Notifications */}
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1a3c7b] hover:bg-blue-50 transition-colors relative">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                        </svg>
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
                    </button>

                    {/* User Profile */}
                    {status === "loading" ? (
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full bg-gray-100 p-0 hover:ring-2 hover:ring-[#1a3c7b] transition-all"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={session.user.image || ""}
                                            alt={session.user.name || ""}
                                        />
                                        <AvatarFallback className="bg-[#1a3c7b] text-white font-bold">
                                            {session.user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                        <AvatarFallback className="bg-[#1a3c7b] text-white text-xs">
                                            {session.user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">{session.user.name}</p>
                                        <p className="text-xs text-gray-500">{session.user.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">👤 โปรไฟล์ของฉัน</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {session.user.role === "ADMIN" && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">🛡️ จัดการระบบ</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    ออกจากระบบ
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            onClick={() => signIn()}
                            size="sm"
                            className="bg-[#1a3c7b] hover:bg-[#15325f] text-white text-sm shadow-sm rounded-full w-10 h-10 p-0 flex items-center justify-center"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu (Keeping existing logic for mobile robustness) */}
        </header>
    );
}
