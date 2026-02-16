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