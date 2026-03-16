"use client";

import type { Entry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TodayEntriesProps = {
  entries: Entry[];
};

export function TodayEntries({ entries }: TodayEntriesProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No entries yet today. What&apos;s giving you energy?
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Today&apos;s moments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-start gap-3 rounded-lg p-3",
              entry.type === "charge"
                ? "bg-charge/5"
                : "bg-drain/5"
            )}
          >
            <div
              className={cn(
                "mt-0.5 h-2 w-2 rounded-full shrink-0",
                entry.type === "charge" ? "bg-charge" : "bg-drain"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed">{entry.whatHappened}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{entry.type}</span>
                {entry.source && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{entry.source}</span>
                  </>
                )}
                <span>·</span>
                <span>{formatTime(entry.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
