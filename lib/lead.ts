import { getDb } from "./firebaseAdmin";
import { twilioClient, TWILIO_NUMBER } from "./twilio";
import { FieldValue } from "firebase-admin/firestore";

export async function notifyTradie(clientId: string, text: string) {
  const db = getDb();
  const clientSnap = await db.collection("clients").doc(clientId).get();
  if (!clientSnap.exists) throw new Error("Client not found");

  const client = clientSnap.data() as any;
  if (!client.notifyPhoneE164) return;

  console.log("------------------------------------------");
  console.log("📢 TRADIE NOTIFICATION TRIGGERED");
  console.log("TO:", client.notifyPhoneE164);
  console.log("BODY:", text);
  console.log("------------------------------------------");

  await twilioClient.messages.create({
    from: TWILIO_NUMBER,
    to: client.notifyPhoneE164,
    body: text,
  });
}

export async function createLead(params: {
  clientId: string;
  source: string;
  customerPhoneE164: string;
  jobSummary?: string;
  suburb?: string;
  urgency?: string;
  priority?: "hot" | "warm" | "cold";
}) {
  const db = getDb()
  const now = FieldValue.serverTimestamp();

  const leadRef = await db.collection("leads").add({
    clientId: params.clientId,
    source: params.source,
    status: "new",
    priority: params.priority ?? "warm",
    customerPhoneE164: params.customerPhoneE164,
    jobSummary: params.jobSummary ?? null,
    suburb: params.suburb ?? null,
    urgency: params.urgency ?? "not_sure",
    lastMessageAt: now,
    createdAt: now,
  });

  return leadRef.id;
}
