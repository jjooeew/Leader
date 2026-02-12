'use server'
import { db } from "@/lib/firebaseAdmin";
import { revalidatePath } from "next/cache";

export async function toggleLeadStatus(leadId: string, currentStatus: string) {

    const nextStatus = currentStatus === 'new' ? 'contacted' : 'new';

  await db.collection("leads").doc(leadId).update({
    status: nextStatus
  });
  
  // This tells Next.js to refresh the dashboard data
  revalidatePath('/dashboard/leads');
}