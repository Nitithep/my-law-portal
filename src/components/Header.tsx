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
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#1a3c7b] via-[#2b5ea7] to-[#4a90d9]" />

            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                {/* Left: Hamburger + Logo + Nav */}
                <div className="flex items-center gap-4">
                    {/* Hamburger Menu Button (Mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-[#1a3c7b] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="เปิดเมนู"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#1a3c7b] shadow-md">
                            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3L3 7v2h18V7L12 3z" />
                                <path d="M5 9v8h2V9M10 9v8h2V9M17 9v8h2V9" />
                                <path d="M3 17h18v2H3z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-[#1a3c7b] tracking-tight leading-none">
                                LAW
                            </span>
                            <span className="text-[9px] text-gray-500 leading-none mt-0.5">
                                ระบบกลางทางกฎหมาย
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Pills (Desktop) */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            href="/"
                            className="px-4 py-1.5 text-sm font-medium text-white bg-[#2b9e76] rounded-full hover:bg-[#249068] transition-colors shadow-sm"
                        >
                            โครงการรับฟัง
                        </Link>
                        <Link
                            href="/#drafts"
                            className="px-4 py-1.5 text-sm font-medium text-white bg-[#e8a100] rounded-full hover:bg-[#d49500] transition-colors shadow-sm"
                        >
                            ฐานข้อมูลกฎหมาย
                        </Link>
                        {session?.user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="px-4 py-1.5 text-sm font-medium text-white bg-[#d94a4a] rounded-full hover:bg-[#c73e3e] transition-colors shadow-sm"
                            >
                                🛡️ จัดการระบบ
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <span className="hidden sm:inline-flex text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded-md bg-gray-50 font-medium">
                        EN
                    </span>

                    {/* Favorite Heart */}
                    {session?.user && (
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                    )}

                    {/* Share */}
                    {session?.user && (
                        <button className="p-2 text-gray-400 hover:text-[#1a3c7b] hover:bg-blue-50 rounded-full transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </button>
                    )}

                    {/* Notification Bell */}
                    {session?.user && (
                        <button className="relative p-2 text-gray-500 hover:text-[#1a3c7b] hover:bg-gray-100 rounded-full transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                        </button>
                    )}

                    {/* User Auth */}
                    {status === "loading" ? (
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-9 w-9 rounded-full ring-2 ring-gray-200 hover:ring-[#2b5ea7] transition-all p-0"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={session.user.image || ""}
                                            alt={session.user.name || ""}
                                        />
                                        <AvatarFallback className="bg-[#1a3c7b] text-white text-xs">
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
                            className="bg-[#1a3c7b] hover:bg-[#15325f] text-white text-sm shadow-sm"
                        >
                            เข้าสู่ระบบ
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#2b9e76]" />
                            โครงการรับฟัง
                        </Link>
                        <Link
                            href="/#drafts"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#e8a100]" />
                            ฐานข้อมูลกฎหมาย
                        </Link>
                        {session?.user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#d94a4a]" />
                                🛡️ จัดการระบบ
                            </Link>
                        )}
                        {!session?.user && (
                            <button
                                onClick={() => { signIn(); setMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#1a3c7b] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#1a3c7b]" />
                                เข้าสู่ระบบ
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
