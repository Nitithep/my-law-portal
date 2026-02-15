"use client";

import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notification-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";

type Notification = {
    id: string;
    title: string;
    message: string;
    link?: string | null;
    read: boolean;
    createdAt: Date;
};

export function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    const handleMarkAsRead = async (id: string, link?: string | null) => {
        await markAsRead(id);

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-blue-50">
                    <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-[#1a3c7b]" : "text-gray-500"}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white ring-1 ring-white" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-semibold text-sm">การแจ้งเตือน</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-[#1a3c7b] hover:underline"
                        >
                            อ่านทั้งหมด
                        </button>
                    )}
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                            ไม่มีการแจ้งเตือน
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/30" : ""}`}
                                    onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                >
                                    <div className="flex gap-3">
                                        <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? "bg-red-500" : "bg-transparent"}`} />
                                        <div className="space-y-1">
                                            <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(notification.createdAt).toLocaleDateString("th-TH", {
                                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
