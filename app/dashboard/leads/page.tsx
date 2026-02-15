import { toggleLeadStatus } from "@/lib/actions";
import { getDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export default async function Page() {
  // Fetch leads from Firestore
  const db = getDb(); // Get the initialized db instance
  const snapshot = await db.collection("leads").get();
  const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">Lead Inbox</h1>
      <div className="grid gap-4">
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{lead.customerPhoneE164}</p>
                <p className="text-gray-600">{lead.jobSummary}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  lead.priority === "hot"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {lead.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Received: {lead.createdAt?.toDate().toLocaleString()}
            </p>
            <div className="mt-4 flex gap-2">
              <form
                action={async () => {
                  "use server";
                  await toggleLeadStatus(lead.id, lead.status);
                }}
              >
                <button
                  className={`text-sm px-3 py-1 rounded transition ${
                    lead.status === "contacted"
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300" // Looks like an "Undo" button
                      : "bg-blue-600 text-white hover:bg-blue-700" // Looks like an "Action" button
                  }`}
                >
                  {lead.status === "contacted"
                    ? "← Mark as New"
                    : "Mark Contacted"}
                </button>
              </form>

              <a
                href={`tel:${lead.customerPhoneE164}`}
                className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
              >
                Call Customer
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
