"use client";

import { sendMessage } from "@/lib/actions";
import { Send } from "lucide-react";
import { useState } from "react";

export function MessageInput({ leadId }: { leadId: string }) {
  const [text, setText] = useState("");
  // const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    const result = await sendMessage(leadId, text);    setText("");
  
    if (result.success) {
      setText(""); // Clear the input on success
    } else {
      alert("Failed to send message. Check console.");
    }
  };



  return (
    <div className="flex gap-2 ">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
      >
        <Send size={20} />
      </button>
    </div>
  );
}
