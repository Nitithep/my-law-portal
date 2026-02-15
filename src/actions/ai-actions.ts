"use server";

import { prisma } from "@/lib/db";

export async function summarizeDraft(draftId: string) {
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock summary based on draft ID (or just generic)
    const draft = await prisma.lawDraft.findUnique({
        where: { id: draftId },
        select: { title: true, description: true }
    });

    if (!draft) return "ไม่พบข้อมูลร่างกฎหมาย";

    return `
**บทสรุปย่อโดย AI:**

ร่างกฎหมาย "**${draft.title}**" มีวัตถุประสงค์หลักเพื่อแก้ไขปัญหา ${draft.description.substring(0, 50)}... 

**ประเด็นสำคัญ:**
1. ปรับปรุงประสิทธิภาพการบริหารงานของหน่วยงานที่เกี่ยวข้อง
2. เพิ่มการมีส่วนร่วมของภาคประชาชนในการตรวจสอบ
3. กำหนดมาตรฐานใหม่ให้สอดคล้องกับสากล

**ผลกระทบที่คาดว่าจะเกิดขึ้น:**
จะช่วยลดขั้นตอนการทำงานที่ซ้ำซ้อนและเพิ่มความโปร่งใสในการดำเนินงาน ทั้งนี้อาจต้องมีการเตรียมความพร้อมด้านบุคลากรและงบประมาณในช่วงแรกของการบังคับใช้
    `.trim();
}

export async function analyzeSentiment(text: string) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const positiveWords = ["ดี", "เห็นด้วย", "สนับสนุน", "ยอดเยี่ยม", "เหมาะสม", "ควร"];
    const negativeWords = ["ไม่เห็นด้วย", "คัดค้าน", "แย่", "ปรับปรุง", "กระทบ", "ปัญหา"];

    let score = 0;
    positiveWords.forEach(w => { if (text.includes(w)) score++; });
    negativeWords.forEach(w => { if (text.includes(w)) score--; });

    if (score > 0) return "POSITIVE";
    if (score < 0) return "NEGATIVE";
    return "NEUTRAL";
}
