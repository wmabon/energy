"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePractice, logPractice } from "@/actions/practices";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate, todayDateString } from "@/lib/utils";

type PracticeWithLogs = {
  id: string;
  userId: string;
  cycleId: string;
  commitmentText: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  logs: { id: string; practiceId: string; loggedDate: string; notes: string | null; createdAt: string }[];
};

type PracticesManagerProps = {
  practices: PracticeWithLogs[];
};

export function PracticesManager({ practices }: PracticesManagerProps) {
  const router = useRouter();
  const [editingPos, setEditingPos] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const positions = [1, 2, 3];
  const today = todayDateString();

  async function handleSave(position: number) {
    setSaving(true);
    const existing = practices.find((p) => p.position === position);
    const formData = new FormData();
    formData.set("commitmentText", editText);
    formData.set("position", String(position));
    if (existing) formData.set("id", existing.id);

    await savePractice(formData);
    setEditingPos(null);
    setEditText("");
    setSaving(false);
    router.refresh();
  }

  async function handleLog(practiceId: string) {
    setSaving(true);
    const formData = new FormData();
    formData.set("practiceId", practiceId);
    formData.set("notes", logNotes);

    await logPractice(formData);
    setLoggingId(null);
    setLogNotes("");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {positions.map((pos) => {
        const practice = practices.find((p) => p.position === pos);
        const isEditing = editingPos === pos;
        const isLogging = loggingId === practice?.id;
        const loggedToday = practice?.logs.some((l) => l.loggedDate === today);

        return (
          <Card key={pos}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shift/10 text-sm font-semibold text-shift">
                  {pos}
                </span>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder={
                          pos === 1
                            ? "Intentionally generate energy by..."
                            : pos === 2
                            ? "Anticipate predictable drains by..."
                            : "Shift my language/focus when..."
                        }
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="shift"
                          size="sm"
                          onClick={() => handleSave(pos)}
                          disabled={!editText.trim() || saving}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingPos(null);
                            setEditText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : practice ? (
                    <div>
                      <p className="text-sm leading-relaxed">
                        {practice.commitmentText}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        {loggedToday ? (
                          <span className="inline-flex items-center gap-1 text-xs text-shift">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Practiced today
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLoggingId(practice.id);
                              setLogNotes("");
                            }}
                          >
                            Log today
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingPos(pos);
                            setEditText(practice.commitmentText);
                          }}
                        >
                          Edit
                        </Button>
                      </div>

                      {isLogging && (
                        <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                          <Textarea
                            placeholder="How did it go? (optional)"
                            value={logNotes}
                            onChange={(e) => setLogNotes(e.target.value)}
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="shift"
                              size="sm"
                              onClick={() => handleLog(practice.id)}
                              disabled={saving}
                            >
                              Log
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLoggingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Recent logs */}
                      {practice.logs.length > 0 && !isLogging && (
                        <div className="mt-3 space-y-1">
                          {practice.logs.slice(0, 3).map((log) => (
                            <div key={log.id} className="text-xs text-muted-foreground">
                              {formatDate(log.loggedDate)}
                              {log.notes && ` — ${log.notes}`}
                            </div>
                          ))}
                          {practice.logs.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{practice.logs.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingPos(pos);
                        setEditText("");
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      + Define commitment {pos}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
