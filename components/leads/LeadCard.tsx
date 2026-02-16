import React from "react";
import { Flame, MapPin, Clock, Phone } from "lucide-react";
import { Lead } from "@/app/types";
import { formatTimeAgo } from "@/lib/utils";
import { CardActions } from "./CardActions";

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-amber-50 text-amber-700 border-amber-100",
  booked: "bg-purple-50 text-purple-700 border-purple-100",
  won: "bg-emerald-50 text-emerald-700 border-emerald-100",
  lost: "bg-slate-50 text-slate-700 border-slate-100",
};

interface LeadCardProps {
  lead: Lead;
  children?: React.ReactNode;
}

export const LeadCard = ({ lead, children }: LeadCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
              lead.priority === "hot"
                ? "bg-red-50 text-red-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {lead.priority === "hot" ? (
              <Flame size={18} fill="currentColor" />
            ) : (
              <Phone size={18} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              {lead.customerPhoneE164}
            </h3>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${STATUS_STYLES[lead.status]}`}
            >
              {lead.status}
            </span>
          </div>
        </div>
        <div className="text-right text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatTimeAgo(lead.createdAt)}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 mb-3 mt-1 leading-relaxed">
        {lead.jobSummary || "No job details provided yet."}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-xs font-semibold">
            {lead.suburb || "Location TBC"}
          </span>
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
};
