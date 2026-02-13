import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        // ถ้าไม่ระบุ email ให้แสดง user ทั้งหมดแล้วตั้งคนแรกเป็น admin
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true },
        });

        if (users.length === 0) {
            console.log("❌ ยังไม่มีผู้ใช้ในระบบ — ต้อง Sign in ด้วย Google ก่อน");
            return;
        }

        console.log("📋 ผู้ใช้ในระบบ:");
        users.forEach((u) => console.log(`  - ${u.email} (${u.name}) [${u.role}]`));

        // ตั้งคนแรกเป็น ADMIN
        const first = users[0];
        await prisma.user.update({
            where: { id: first.id },
            data: { role: "ADMIN" },
        });
        console.log(`\n✅ ตั้ง ${first.email} เป็น ADMIN เรียบร้อย!`);
    } else {
        // ตั้ง admin ตาม email ที่ระบุ
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log(`❌ ไม่พบผู้ใช้ ${email} — ต้อง Sign in ด้วย Google ก่อน`);
            return;
        }
        await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" },
        });
        console.log(`✅ ตั้ง ${email} เป็น ADMIN เรียบร้อย!`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
