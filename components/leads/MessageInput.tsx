"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function MessageInput() {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    console.log("Sending:", text); // We'll hook this to a Server Action later
    setText("");
  };

  return (
    <div className="mt-4 flex gap-2 ">
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