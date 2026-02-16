"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";

export default function LeadSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    // Updates the URL without a full page reload
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms delay

  return (
    <div className="relative">
      <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search suburb, job details..."
        className="w-full bg-white border border-slate-200 rounded-xl px-11 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-slate-900"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}