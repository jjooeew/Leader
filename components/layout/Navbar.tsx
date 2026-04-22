"use client"

import { Bell, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-4 rounded-2xl z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo */}
          <Link href="/dashboard/leads" className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <CheckCircle2 className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Leader
            </span>
          </Link>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell with Red Dot */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* User Profile Avatar */}
            <button className="flex items-center justify-center w-9 h-9 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}