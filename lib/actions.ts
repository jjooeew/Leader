"use server";

import { getDb } from "./firebaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const db = getDb();
  
  try {
    await db.collection("leads").doc(leadId).update({
      status: newStatus,
      updatedAt: new Date(),
    });

    // This clears the cache so the dashboard and detail page show the new status immediately
    revalidatePath(`/dashboard/leads`);
    revalidatePath(`/dashboard/leads/${leadId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false };
  }
}

// export async function sendMessage(leadId: string, text: string) {
//   const db = getDb();
  
//   try {

//     console.log(`Attempting to send message to lead: ${leadId}`)
//     await db
//       .collection("leads")
//       .doc(leadId)
//       .collection("messages")
//       .add({
//         text,
//         sender: "user", // The tradie is the one sending from the app
//         createdAt: new Date(), // Firestore Admin handles this as a Timestamp
//       });

//     revalidatePath(`/dashboard/leads/${leadId}`);
//     return { success: true };
//   } catch (error) {
//     console.error("Error sending message:", error);
//     return { success: false };
//   }
// }

export async function sendMessage(leadId: string, text: string) {
  const db = getDb();
  
  // 1. Get the lead to find the customer's phone number
  const leadDoc = await db.collection("leads").doc(leadId).get();
  const leadData = leadDoc.data();
  if (!leadData) return;

  // 2. Save the message to Firestore (what you have now)
  await leadDoc.ref.collection("messages").add({
    text,
    sender: "user", // The Tradie
    createdAt: new Date(),
  });

  // 3. ACTUAL SEND: Trigger WebSMS
  const cleanPhone = leadData.customerPhoneE164.replace("+", "");
  await fetch("https://websms.co.nz/api/connexus/sms/out", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      userId: process.env.WEBSMS_USER!,
      password: process.env.WEBSMS_PASSWORD!,
      to: cleanPhone,
      body: text,
      messageId: leadId 
    }),
  });

  revalidatePath(`/dashboard/leads/${leadId}`);
  return { success: true };
}

