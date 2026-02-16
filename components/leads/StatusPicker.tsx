"use client";

import { useState } from "react";
import { updateLeadStatus } from "@/lib/actions";
import { ChevronDown, Check } from "lucide-react";

const statuses = [
  { id: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  {
    id: "contacted",
    label: "Contacted",
    color: "bg-purple-100 text-purple-700",
  },
  { id: "quoted", label: "Quoted", color: "bg-orange-100 text-orange-700" },
  { id: "booked", label: "Booked", color: "bg-green-100 text-green-700" },
  { id: "lost", label: "Lost", color: "bg-slate-100 text-slate-500" },
];

export function StatusPicker({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const activeStatus =
    statuses.find((s) => s.id === currentStatus) || statuses[0];

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    setIsOpen(false);
    await updateLeadStatus(leadId, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition ${activeStatus.color} ${isUpdating ? "opacity-50 animate-pulse" : "hover:brightness-95"}`}
      >
        {activeStatus.label}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => handleUpdate(s.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-700">{s.label}</span>
                {currentStatus === s.id && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
