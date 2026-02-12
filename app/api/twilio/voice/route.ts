import { NextResponse } from "next/server";
import { twilioClient, TWILIO_NUMBER } from "@/lib/twilio";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const customerPhone = String(formData.get("From") || ""); // The person calling
    const twilioNumber = String(formData.get("To") || "");   // Your Twilio number

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

    const clientData = clientSnap.docs[0].data();
    const tradieName = clientData.name || "us";

    // 2. Send the Auto-Reply SMS to the customer
    await twilioClient.messages.create({
      from: twilioNumber,
      to: customerPhone,
      body: `Hi! Thanks for calling ${tradieName}. We're on a job right now—reply to this text with your suburb and what you need help with, and we'll get back to you ASAP!`,
    });

    // 3. Tell Twilio what to do with the actual voice call
    // For V1, we will just play a message and hang up, or you can forward it.
    const twiml = `
      <Response>
        <Say>Hi, thanks for calling. We can't take your call right now, but we just sent you a text message to start your booking.</Say>
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