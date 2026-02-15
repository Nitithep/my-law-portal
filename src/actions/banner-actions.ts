"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("กรุณาเข้าสู่ระบบ");
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });
    if (user?.role !== Role.ADMIN) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง — เฉพาะผู้ดูแลระบบเท่านั้น");
    }
    return session.user.id;
}

export async function getBanners() {
    return await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
}

export async function getAllBannersAdmin() {
    await requireAdmin();
    return await prisma.banner.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createBanner(data: {
    title?: string | null;
    image: string;
    link?: string | null;
    isActive?: boolean;
    order?: number;
}) {
    await requireAdmin();

    await prisma.banner.create({
        data: {
            title: data.title,
            image: data.image,
            link: data.link,
            isActive: data.isActive ?? true,
            order: data.order ?? 0,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");
}

export async function updateBanner(
    id: string,
    data: {
        title?: string | null;
        image?: string;
        link?: string | null;
        isActive?: boolean;
        order?: number;
    }
) {
    await requireAdmin();

    await prisma.banner.update({
        where: { id },
        data,
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");
}

export async function deleteBanner(id: string) {
    await requireAdmin();

    await prisma.banner.delete({
        where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");
}

export async function reorderBanners(orderedIds: string[]) {
    await requireAdmin();

    const updates = orderedIds.map((id, index) =>
        prisma.banner.update({
            where: { id },
            data: { order: index },
        })
    );

    await prisma.$transaction(updates);

    revalidatePath("/");
    revalidatePath("/admin/banners");
}
