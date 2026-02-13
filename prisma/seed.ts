import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await hash("password", 12);
    const user = await prisma.user.upsert({
        where: { email: "admin@law.go.th" },
        update: {},
        create: {
            email: "admin@law.go.th",
            name: "Admin",
            password,
            role: "ADMIN",
        },
    });

    // Create specific draft for UI testing
    const draft = await prisma.lawDraft.create({
        data: {
            title: "ร่างพระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ ..) พ.ศ. ....",
            description: "ร่างพระราชบัญญัตินี้มีวัตถุประสงค์เพื่อปรับปรุงการบริหารจัดการการศึกษาของชาติให้มีประสิทธิภาพมากยิ่งขึ้น โดยมุ่งเน้นการพัฒนาคุณภาพและมาตรฐานการศึกษาทุกระดับ",
            category: "การศึกษา",
            agency: "กระทรวงศึกษาธิการ",
            status: "OPEN",
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            hearingTime: "ครั้งที่ 1",
            affectedParties: "นักเรียน, ครู, ผู้ปกครอง, สถานศึกษา",
            image: "https://placehold.co/600x400/png",
            version: 1,
            projectDetails: "โครงการปรับปรุงพระราชบัญญัติการศึกษาแห่งชาติ เพื่อยกระดับคุณภาพและเพิ่มความเท่าเทียมในการเข้าถึงการศึกษาสำหรับประชาชนทุกกลุ่ม",
            hearingSummary: "ผลการรับฟังความคิดเห็น:\n\n1. ผู้ร่วมแสดงความคิดเห็นทั้งหมด 1,245 คน\n2. เห็นด้วย 78% ไม่เห็นด้วย 22%\n3. ข้อเสนอแนะหลัก: ควรเพิ่มงบประมาณด้านเทคโนโลยีการศึกษา",
            hearingSummaryPublished: false,
            sections: {
                create: [
                    { sectionNo: "มาตรา 1", content: "พระราชบัญญัตินี้เรียกว่า พระราชบัญญัติการศึกษาแห่งชาติ (ฉบับที่ ..) พ.ศ. ...." },
                    { sectionNo: "มาตรา 2", content: "พระราชบัญญัตินี้ให้ใช้บังคับตั้งแต่วันถัดจากวันประกาศในราชกิจจานุเบกษาเป็นต้นไป" },
                    { sectionNo: "มาตรา 3", content: "ให้ยกเลิกความในมาตรา 12 แห่งพระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542 และให้ใช้ความต่อไปนี้แทน" },
                ]
            },
            surveyQuestions: {
                create: [
                    { question: "ท่านเห็นด้วยกับร่างประกาศกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม เรื่อง แนวปฏิบัติเพื่อให้การจัดการอุดมศึกษาเป็นไปตามหลักธรรมาภิบาล หรือไม่", order: 1 },
                    { question: "ท่านเห็นด้วยกับการยกเลิกแนวปฏิบัติตามหลักธรรมาภิบาลในสถาบันอุดมศึกษาทั้งสองฉบับหรือไม่ (ร่างข้อ 3)", order: 2 },
                    { question: "ท่านเห็นด้วยกับหลักเกณฑ์การส่งเสริมธรรมาภิบาลที่กำหนดในร่างหรือไม่ (ร่างข้อ 4-8)", order: 3 },
                    { question: "ท่านเห็นด้วยกับมาตรการกำกับดูแลด้านธรรมาภิบาลของสถาบันอุดมศึกษาหรือไม่ (ร่างข้อ 9)", order: 4 },
                ]
            },
            attachments: {
                create: [
                    { fileName: "ร่างพระราชบัญญัติการศึกษาแห่งชาติ.pdf", fileUrl: "#" },
                    { fileName: "เอกสารประกอบการพิจารณา.pdf", fileUrl: "#" },
                ]
            }
        }
    });

    console.log({ user, draft });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
