import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { createLead, notifyTradie } from "@/lib/lead";

export async function POST(req: Request) {
  const db = getDb();
  try {
    const formData = await req.formData();
    const customerPhone = String(formData.get("From") || "");
    const twilioNumber = String(formData.get("To") || "");
    const messageBody = String(formData.get("Body") || "");

    // 1. Find the client
    const clientSnap = await db
      .collection("clients")
      .where("twilioNumberE164", "==", twilioNumber)
      .limit(1)
      .get();

    if (clientSnap.empty) return new NextResponse("");
    const clientId = clientSnap.docs[0].id;

    // 2. Create the Lead in Firestore
    const leadId = await createLead({
      clientId,
      source: "sms_reply",
      customerPhoneE164: customerPhone,
      jobSummary: messageBody,
    });

    // 3. Notify the Tradie (Send a text to their personal phone)
    await notifyTradie(
      clientId,
      `New Lead: ${messageBody.slice(0, 50)}... Call customer at ${customerPhone}`
    );

    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("SMS Webhook Error:", error);
    return new NextResponse("");
  }
}