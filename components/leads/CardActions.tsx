"use client";

export function CardActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}