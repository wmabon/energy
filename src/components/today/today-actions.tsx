"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TodayActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link href="/log?type=charge" className="block">
        <Button variant="charge" size="lg" className="w-full flex-col gap-1 h-20 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-xs font-medium">Charge</span>
        </Button>
      </Link>
      <Link href="/log?type=drain" className="block">
        <Button variant="drain" size="lg" className="w-full flex-col gap-1 h-20 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-xs font-medium">Drain</span>
        </Button>
      </Link>
      <Link href="/shift" className="block">
        <Button variant="shift" size="lg" className="w-full flex-col gap-1 h-20 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span className="text-xs font-medium">Shift</span>
        </Button>
      </Link>
    </div>
  );
}
