import { getDb } from "./firebaseAdmin";
import { twilioClient, TWILIO_NUMBER } from "./twilio";
import { FieldValue } from "firebase-admin/firestore";

const NZ_SUBURBS = [
  "One Tree Hill",
  "Grey Lynn",
  "Ponsonby",
  "Riccarton",
  "Petone",
  "CBD",
  "Mt Eden",
  "Newmarket",
];

const URGENT_KEYWORDS = [
  "burst",
  "flood",
  "urgent",
  "emergency",
  "leaking",
  "today",
  "asap",
  "no water",
];

function extractSuburb(text: string): string | null {
  const lowercaseText = text.toLowerCase();
  const found = NZ_SUBURBS.find((s) => lowercaseText.includes(s.toLowerCase()));
  return found || null;
}

function determinePriority(text: string): "hot" | "warm" {
  const lowercaseText = text.toLowerCase();
  const isUrgent = URGENT_KEYWORDS.some((word) => lowercaseText.includes(word));
  return isUrgent ? "hot" : "warm";
}

export async function notifyTradie(clientId: string, text: string) {
  const db = getDb();
  const clientSnap = await db.collection("clients").doc(clientId).get();
  if (!clientSnap.exists) throw new Error("Client not found");

  const client = clientSnap.data() as any;
  if (!client.notifyPhoneE164) return;

  await twilioClient.messages.create({
    from: TWILIO_NUMBER,
    to: client.notifyPhoneE164,
    body: text,
  });
}

export async function updateLeadWithReply(leadId: string, rawText: string) {
  const db = getDb();
  const now = FieldValue.serverTimestamp();

  const leadRef = db.collection("leads").doc(leadId);
  const leadSnap = await leadRef.get();
  const leadData = leadSnap.data();

  if (leadData?.status === "new") {
    const detectedSuburb = extractSuburb(rawText);
    const detectedPriority = determinePriority(rawText);

    // Update the existing lead document with the extracted info
    await db
      .collection("leads")
      .doc(leadId)
      .update({
        jobSummary: rawText,
        suburb: detectedSuburb,
        priority: detectedPriority,
        urgency: detectedPriority === "hot" ? "URGENT" : "normal",
        source: "sms_reply", // Update source since they actually replied now
        lastMessageAt: now,
        updatedAt: now,
        status: "active",
      });
  } else {
    await leadRef.update({
      lastMessageAt: now,
      updatedAt: now,
    });
  }
}

export async function createLead(params: {
  clientId: string;
  source: string;
  customerPhoneE164: string;
  rawText: string;
  jobSummary?: string;
  suburb?: string;
  priority?: "hot" | "warm" | "cold";
  customerName?: string;
}) {
  const db = getDb();
  const now = FieldValue.serverTimestamp();

  const detectedSuburb = extractSuburb(params.rawText);
  const detectedPriority = determinePriority(params.rawText);

  const leadRef = await db.collection("leads").add({
    clientId: params.clientId,
    source: params.source,
    status: "new",
    priority: params.priority ?? detectedPriority,
    customerPhoneE164: params.customerPhoneE164,
    jobSummary: params.jobSummary ?? params.rawText,
    suburb: params.suburb ?? detectedSuburb,
    urgency:
      params.priority === "hot" || detectedPriority === "hot"
        ? "URGENT"
        : "normal",
    lastMessageAt: now,
    createdAt: now,
  });

  return leadRef.id;
}
