import { NextResponse } from "next/server";
import { twilioClient, TWILIO_NUMBER } from "@/lib/twilio";
import { getDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const db = getDb();
  try {
    const formData = await req.formData();
    const customerPhone = String(formData.get("From") || ""); // The person calling
    const twilioNumber = String(formData.get("To") || ""); // Your Twilio number

    // 1. Find the tradie/client assigned to this Twilio number
    const clientSnap = await db
      .collection("clients")
      .where("twilioNumberE164", "==", twilioNumber)
      .limit(1)
      .get();

    if (clientSnap.empty) {
      console.error("No client found for number:", twilioNumber);
      return new NextResponse("<Response><Say>Error</Say></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const clientDoc = clientSnap.docs[0];
    const clientData = clientSnap.docs[0].data();
    const tradieName = clientData.name || "us";

    // 2. TRIGGER WEBSMS (Replacing Twilio SMS)

    // A. Create the Lead in Firestore FIRST
    // This generates the ID we need for tracking the reply
    const leadRef = await db.collection("leads").add({
      customerPhoneE164: customerPhone,
      clientId: clientDoc.id,
      status: "new",
      createdAt: new Date(),
    });

    // B. Clean the number for WebSMS (remove the '+')
    const cleanPhone = customerPhone.replace("+", "");
    const smsMessage = `Hi! Thanks for calling ${tradieName}. We're on a job right now—reply to this text with your suburb and what you need help with, and we'll get back to you ASAP! (Reply STOP to opt-out)`;

    // C. Trigger WebSMS using the Lead ID as the messageId
    const webSmsRes = await fetch("https://websms.co.nz/api/connexus/sms/out", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        userId: process.env.WEBSMS_USER!,
        password: process.env.WEBSMS_PASSWORD!,
        to: cleanPhone,
        body: smsMessage,
        messageId: leadRef.id, // This is the secret sauce for tracking
      }),
    });

    if (!webSmsRes.ok) {
      console.error("WebSMS failed to send:", await webSmsRes.text());
    }

    // 3. Tell Twilio what to do with the actual voice call
    const twiml = `
      <Response>
        <Say>Hey buddy. We can't take your call right now, but we sent you a text message to start your booking.</Say>
        <Hangup />
      </Response>
    `;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Voice Webhook Error:", error);
    return new NextResponse("<Response><Reject /></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
