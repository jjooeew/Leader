import { updateLeadStatus } from "@/lib/actions";
import { getDb } from "@/lib/firebaseAdmin";
import { LeadCard } from "@/components/leads/LeadCard";
import { Lead } from "@/app/types";
import Link from "next/link";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import LeadSearch from "@/components/leads/LeadSearch";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

interface DashboardProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
}

export default async function Page({ searchParams }: DashboardProps) {
  const filters = await searchParams;
  const currentStatus = filters.status || "all";
  const searchQuery = filters.q || "";

  const db = getDb();
  let query: any = db.collection("leads").orderBy("createdAt", "desc");

  if (currentStatus !== "all") {
    query = query.where("status", "==", currentStatus);
  }

  const snapshot = await query.get();

  // Data Cleaning & Search Logic
  const leads = snapshot.docs
    .map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt:
          data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      };
    })
    .filter((lead: any) => {
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      return (
        lead.suburb?.toLowerCase().includes(term) ||
        lead.jobSummary?.toLowerCase().includes(term) ||
        lead.customerPhoneE164.includes(term)
      );
    }) as Lead[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <Navbar />

      <div className="mt-4 max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 ">Lead Inbox</h1>
      </div>

      {/* 1. Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <LeadSearch />
      </div>

      {/* 2. Filter Pills */}
      <div className="max-w-2xl mx-auto flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {["all", "contacted", "quoted", "booked", "lost"].map((s) => (
          <Link
            key={s}
            href={`/dashboard/leads?status=${s}${searchQuery ? `&q=${searchQuery}` : ""}`}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
              currentStatus === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="max-w-2xl mx-auto grid gap-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead.id} className="relative group">
              <Link
                href={`/dashboard/leads/${lead.id}`}
                className="absolute inset-0 z-0"
              />
              <LeadCard key={lead.id} lead={lead}>
                {/* These buttons are passed into the 'children' slot of the LeadCard */}
                <form
                  action={async () => {
                    "use server";
                    await updateLeadStatus(lead.id, lead.status);
                  }}
                >
                  {/* <button
                    className={`text-[11px] font-bold uppercase tracking-tight px-3 py-1.5 rounded-lg border transition ${
                      lead.status === "contacted"
                        ? "bg-slate-100 text-slate-500 border-slate-200"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {lead.status === "contacted" ? "Undo" : "Done"}
                  </button> */}
                </form>

                <a
                  href={`tel:${lead.customerPhoneE164}`}
                  className="text-[11px] font-bold uppercase tracking-tight bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  Call
                </a>
              </LeadCard>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm font-medium">
            No leads found matching "{currentStatus}"
          </div>
        )}
      </div>
    </div>
  );
}
