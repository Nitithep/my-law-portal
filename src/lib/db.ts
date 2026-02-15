import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Check for stale instance (dev hot-reload issue)
if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
    // @ts-ignore - check if 'banner' exists on the instance
    if (!globalForPrisma.prisma.banner) {
        console.warn("Detected stale Prisma client (missing 'banner'). Recreating...");
        globalForPrisma.prisma.$disconnect();
        // @ts-ignore
        globalForPrisma.prisma = undefined;
    }
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
