"use client";

import { Message } from "@/app/types"; // Assuming you add the interface there

export function MessageThread({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4 p-4 h-100 overflow-y-auto bg-slate-50 rounded-2xl border border-slate-100">
      {messages.map((msg) => {
        const isLead = msg.sender === "lead";
        
        return (
          <div
            key={msg.id}
            className={`flex ${isLead ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                isLead
                  ? "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                  : "bg-blue-600 text-white rounded-tr-none"
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <span 
                className={`text-[10px] mt-1 block opacity-60 ${
                  isLead ? "text-slate-500" : "text-blue-100"
                }`}
              >
                12:45 PM
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}