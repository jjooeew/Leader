import { getDb } from "@/lib/firebaseAdmin";
import { Lead } from "@/app/types";
import { formatTimeAgo } from "@/lib/utils";
import { Phone, MessageSquare, MapPin, Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LeadDetailProps {
  params: Promise<{ 
    id: string;
  }>;
}

export default async function LeadDetail({ params }: LeadDetailProps) {
  const { id } = await params;

  const db = getDb();
  const doc = await db.collection("leads").doc(id).get();

  if (!doc.exists) return notFound();

  const data = doc.data();
  const lead = {
    ...data,
    id: doc.id,
    createdAt:
      data?.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
  } as Lead;
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
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
          <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold border border-blue-100 uppercase">
            {lead.status}
          </div>
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

        {/* Chat History Section */}
        <div className="pt-4 flex items-center gap-2 text-slate-400 mb-2">
          <MessageSquare size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Chat History
          </span>
        </div>

        {/* Message Bubble (Mock) */}
        <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none max-w-[85%] text-sm text-slate-700 leading-relaxed">
          {lead.jobSummary}
          <div className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
            10:15 AM
          </div>
        </div>
      </div>

      {/* Footer Input Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Send an SMS..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
