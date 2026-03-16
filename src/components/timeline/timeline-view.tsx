"use client";

import { useState } from "react";
import type { Entry } from "@/types";
import { Chip } from "@/components/ui/chip";
import { cn, formatDate, formatTime } from "@/lib/utils";

type TimelineViewProps = {
  entries: Entry[];
};

export function TimelineView({ entries }: TimelineViewProps) {
  const [filter, setFilter] = useState<"all" | "charge" | "drain">("all");

  const filtered = filter === "all"
    ? entries
    : entries.filter((e) => e.type === filter);

  // Group by date
  const grouped = new Map<string, Entry[]>();
  for (const entry of filtered) {
    const date = entry.entryDate;
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(entry);
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Your timeline will appear here as you log entries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Chip label="All" selected={filter === "all"} onClick={() => setFilter("all")} />
        <Chip label="Charges" selected={filter === "charge"} onClick={() => setFilter("charge")} variant="charge" />
        <Chip label="Drains" selected={filter === "drain"} onClick={() => setFilter("drain")} variant="drain" />
      </div>

      {Array.from(grouped.entries()).map(([date, dayEntries]) => (
        <div key={date}>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {formatDate(date)}
          </h3>
          <div className="space-y-2">
            {dayEntries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-border p-4",
                  entry.type === "charge" ? "border-l-2 border-l-charge" : "border-l-2 border-l-drain"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{entry.whatHappened}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 font-medium",
                      entry.type === "charge"
                        ? "bg-charge/10 text-charge"
                        : "bg-drain/10 text-drain"
                    )}>
                      {entry.type}
                    </span>
                    {entry.source && <span>{entry.source}</span>}
                    {entry.predictable !== null && (
                      <span>{entry.predictable ? "predictable" : "unexpected"}</span>
                    )}
                    <span>{formatTime(entry.createdAt)}</span>
                  </div>
                  {entry.expectation && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      &ldquo;{entry.expectation}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
