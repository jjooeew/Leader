import { getDb } from "@/lib/firebaseAdmin";
import { Lead, Message } from "@/app/types";
import { formatTimeAgo } from "@/lib/utils";
import { Phone, MessageSquare, MapPin, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPicker } from "@/components/leads/StatusPicker";
import { MessageThread } from "@/components/leads/MessageThread";
import { MessageInput } from "@/components/leads/MessageInput";

interface LeadDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LeadDetail({ params }: LeadDetailProps) {
  const { id } = await params;

  const db = getDb();

  const leadDoc = await db.collection("leads").doc(id).get();
  if (!leadDoc.exists) return notFound();

  // 1. Fetch lead data
  const leadData = leadDoc.data();
  const lead = {
    ...leadData,
    id: leadDoc.id,
    createdAt:
      leadData?.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
  } as Lead;

  // 2. Fetch Messages Sub-collection
  // We order by 'createdAt' so the conversation reads top-to-bottom
  const messagesSnapshot = await db
    .collection("leads")
    .doc(id)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .get();

  // 3. Map Firestore docs to your Message type
  const messages = messagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Convert Firestore Timestamp to string for the Client Component
    createdAt:
      doc.data().createdAt?.toDate?.().toISOString() ||
      new Date().toISOString(),
  })) as Message[];

  return (
    <div className="h-screen bg-slate-50 font-sans pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">
              {lead.customerName || "Unknown Customer"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {lead.customerPhoneE164}
            </p>
          </div>
        </div>
        <a
          href={`tel:${lead.customerPhoneE164}`}
          className="bg-emerald-50 text-emerald-600 p-2.5 rounded-full hover:bg-emerald-100 transition"
        >
          <Phone size={20} fill="currentColor" />
        </a>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Status Picker (Placeholder for now) */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Current Status
          </span>
          <StatusPicker leadId={id} currentStatus={lead.status} />
        </div>

        {/* Inquiry Details Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            Inquiry Details
          </span>
          <h2 className="font-bold text-slate-900 text-lg leading-snug">
            {lead.jobSummary}
          </h2>
          <div className="flex gap-4 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 text-xs">
              <MapPin size={14} className="text-blue-500" />{" "}
              {lead.suburb || "TBC"}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock size={14} className="text-blue-500" />{" "}
              {formatTimeAgo(lead.createdAt)}
            </div>
          </div>
        </div>

        {/* Chat Section */}

        {/* <div className="mt-8">
          <div className="pt-4 flex items-center gap-2 text-slate-400 mb-2">
            <MessageSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Chat History
            </span>
          </div>
          <MessageThread messages={mockMessages} />
          <MessageInput />
        </div> */}
        <div className="mt-8">
          <div className="pt-4 flex items-center gap-2 text-slate-400 mb-2">
            <MessageSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Chat History
            </span>
          </div>
          
          {/* 5. Pass real messages to the thread */}
          <MessageThread messages={messages} />
          
          {/* 6. Pass leadId to the input so it knows where to save new messages */}
          <MessageInput leadId={id} />
        </div>
      </div>
    </div>
  );
}
