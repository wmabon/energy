"use client";

import { useState } from "react";
import type { Entry, Shift } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

type PatternsSummaryProps = {
  entries: Entry[];
  shifts: Shift[];
};

function extractTopPhrases(texts: string[], limit = 5): { text: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const text of texts) {
    // Normalize and split into meaningful phrases (3+ words)
    const words = text.toLowerCase().trim().split(/\s+/);
    // Use whole text if short, otherwise take key phrases
    if (words.length <= 6) {
      const key = words.join(" ");
      freq.set(key, (freq.get(key) || 0) + 1);
    } else {
      // Just use the full text as a theme
      const key = text.toLowerCase().trim().slice(0, 80);
      freq.set(key, (freq.get(key) || 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function PatternsSummary({ entries, shifts }: PatternsSummaryProps) {
  const [filter, setFilter] = useState<"all" | "charge" | "drain">("all");

  const filteredEntries = filter === "all"
    ? entries
    : entries.filter((e) => e.type === filter);

  const charges = entries.filter((e) => e.type === "charge");
  const drains = entries.filter((e) => e.type === "drain");

  const chargeThemes = extractTopPhrases(charges.map((e) => e.whatHappened));
  const drainThemes = extractTopPhrases(drains.map((e) => e.whatHappened));
  const expectations = extractTopPhrases(
    filteredEntries.map((e) => e.expectation).filter(Boolean) as string[]
  );
  const languages = extractTopPhrases(
    filteredEntries.map((e) => e.innerLanguage).filter(Boolean) as string[]
  );
  const helpers = extractTopPhrases(
    filteredEntries.map((e) => e.whatHelped).filter(Boolean) as string[]
  );

  const predictableDrains = drains.filter((e) => e.predictable === true).length;
  const shiftSuccessRate = shifts.length > 0
    ? Math.round((shifts.filter((s) => s.stateShifted).length / shifts.length) * 100)
    : 0;

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Start logging entries to see patterns emerge here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex gap-2">
        <Chip label="All" selected={filter === "all"} onClick={() => setFilter("all")} />
        <Chip label="Charges" selected={filter === "charge"} onClick={() => setFilter("charge")} variant="charge" />
        <Chip label="Drains" selected={filter === "drain"} onClick={() => setFilter("drain")} variant="drain" />
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-charge">{charges.length}</p>
            <p className="text-xs text-muted-foreground">Charges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-drain">{drains.length}</p>
            <p className="text-xs text-muted-foreground">Drains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-shift">{shifts.length}</p>
            <p className="text-xs text-muted-foreground">Shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charge themes */}
      {chargeThemes.length > 0 && (filter === "all" || filter === "charge") && (
        <PatternCard
          title="What charges you"
          items={chargeThemes}
          color="charge"
        />
      )}

      {/* Drain themes */}
      {drainThemes.length > 0 && (filter === "all" || filter === "drain") && (
        <PatternCard
          title="What drains you"
          items={drainThemes}
          color="drain"
        />
      )}

      {/* Predictable drains */}
      {predictableDrains > 0 && (filter === "all" || filter === "drain") && (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-lg font-semibold text-drain">{predictableDrains}</span>
              {" "}of your drains were predictable — patterns you can anticipate.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Expectations */}
      {expectations.length > 0 && (
        <PatternCard
          title="Recurring expectations"
          items={expectations}
          color="muted"
        />
      )}

      {/* Inner language */}
      {languages.length > 0 && (
        <PatternCard
          title="Inner language patterns"
          items={languages}
          color="muted"
        />
      )}

      {/* What helps */}
      {helpers.length > 0 && (
        <PatternCard
          title="What helps you shift"
          items={helpers}
          color="shift"
        />
      )}

      {/* Shift success */}
      {shifts.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-lg font-semibold text-shift">{shiftSuccessRate}%</span>
              {" "}of your shifts led to a state change.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PatternCard({
  title,
  items,
  color,
}: {
  title: string;
  items: { text: string; count: number }[];
  color: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1 h-2 w-2 rounded-full shrink-0",
                color === "charge" && "bg-charge",
                color === "drain" && "bg-drain",
                color === "shift" && "bg-shift",
                color === "muted" && "bg-muted-foreground"
              )}
            />
            <p className="text-sm leading-relaxed flex-1">
              {item.text}
              {item.count > 1 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  x{item.count}
                </span>
              )}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
