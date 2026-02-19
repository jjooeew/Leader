import { getDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { updateLeadWithReply, notifyTradie } from "@/lib/lead";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const customerPhone = data.from; // e.g., +64210685542
    const messageText = decodeURIComponent(data.body.replace(/\+/g, ' '));
    
    const db = getDb();
    let leadId = null;

    // 1. Search for the most recent 'new' lead for this phone number
    const latestLeadSnap = await db.collection("leads")
      .where("customerPhoneE164", "==", customerPhone)
      .where("status", "==", "new")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!latestLeadSnap.empty) {
      leadId = latestLeadSnap.docs[0].id;
      console.log("Matched message to Lead ID:", leadId);
    } else {
      // 2. If no 'new' lead, just find the absolute most recent lead
      const fallbackSnap = await db.collection("leads")
        .where("customerPhoneE164", "==", customerPhone)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
      
      if (!fallbackSnap.empty) {
        leadId = fallbackSnap.docs[0].id;
      }
    }

    if (!leadId) {
      console.error("Could not find any lead for phone:", customerPhone);
      return NextResponse.json({ error: "No lead found" }, { status: 404 });
    }

    // 3. Update the lead using your existing logic
    await updateLeadWithReply(leadId, messageText);

    // 4. Save to messages sub-collection
    await db.collection("leads").doc(leadId).collection("messages").add({
      text: messageText,
      sender: "lead",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Receive logic failed:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}