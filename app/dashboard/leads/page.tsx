import { toggleLeadStatus } from "@/lib/actions";
import { getDb } from "@/lib/firebaseAdmin";
import { LeadCard } from "@/components/leads/LeadCard.";
import { Lead } from "@/app/types";

export const dynamic = "force-dynamic";

export default async function Page() {

  const db = getDb();
  // Fetch and cast to your Lead type
  const snapshot = await db.collection("leads").orderBy("createdAt", "desc").get();
  const leads = snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...doc.data() 
  })) as Lead[];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Lead Inbox</h1>
      
      <div className="max-w-2xl mx-auto grid gap-4">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead}>
            {/* These buttons are passed into the 'children' slot of the LeadCard */}
            <form
              action={async () => {
                "use server";
                await toggleLeadStatus(lead.id, lead.status);
              }}
            >
              <button
                className={`text-[11px] font-bold uppercase tracking-tight px-3 py-1.5 rounded-lg border transition ${
                  lead.status === "contacted"
                    ? "bg-slate-100 text-slate-500 border-slate-200"
                    : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {lead.status === "contacted" ? "Undo" : "Done"}
              </button>
            </form>

            <a
              href={`tel:${lead.customerPhoneE164}`}
              className="text-[11px] font-bold uppercase tracking-tight bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              Call
            </a>
          </LeadCard>
        ))}
      </div>
    </div>
  );
}