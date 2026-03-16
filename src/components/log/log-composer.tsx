"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEntry } from "@/actions/entries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import type { EntryType, Source } from "@/types";

type LogComposerProps = {
  initialType: EntryType;
};

export function LogComposer({ initialType }: LogComposerProps) {
  const router = useRouter();
  const [type, setType] = useState<EntryType>(initialType);
  const [whatHappened, setWhatHappened] = useState("");
  const [source, setSource] = useState<Source | null>(null);
  const [predictable, setPredictable] = useState<boolean | null>(null);
  const [expectation, setExpectation] = useState("");
  const [innerLanguage, setInnerLanguage] = useState("");
  const [whatHelped, setWhatHelped] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);

  const isCharge = type === "charge";

  async function handleSave() {
    if (!whatHappened.trim()) return;
    setSaving(true);

    const formData = new FormData();
    formData.set("type", type);
    formData.set("whatHappened", whatHappened);
    if (source) formData.set("source", source);
    if (predictable !== null) formData.set("predictable", String(predictable));
    if (expectation) formData.set("expectation", expectation);
    if (innerLanguage) formData.set("innerLanguage", innerLanguage);
    if (whatHelped) formData.set("whatHelped", whatHelped);

    const result = await createEntry(formData);
    if (result.success) {
      router.push("/today");
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Cancel
        </button>
        <h1 className="text-lg font-semibold">
          Log {isCharge ? "charge" : "drain"}
        </h1>
        <div className="w-12" />
      </div>

      {/* Type toggle */}
      <div className="flex gap-2 justify-center">
        <Chip
          label="Charge"
          selected={type === "charge"}
          onClick={() => setType("charge")}
          variant="charge"
        />
        <Chip
          label="Drain"
          selected={type === "drain"}
          onClick={() => setType("drain")}
          variant="drain"
        />
      </div>

      {/* Step 1: What happened */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {isCharge ? "What gave you energy?" : "What drained you?"}
        </label>
        <Textarea
          placeholder={isCharge
            ? "A great conversation, finishing a project, time outside..."
            : "A frustrating meeting, overthinking, comparison..."
          }
          value={whatHappened}
          onChange={(e) => setWhatHappened(e.target.value)}
          autoFocus
          rows={3}
        />
      </div>

      {whatHappened.trim() && step === 0 && (
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => setStep(1)}
        >
          Go deeper (optional)
        </Button>
      )}

      {/* Step 2: Deeper prompts */}
      {step >= 1 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Where did this come from?
            </label>
            <div className="flex gap-2">
              {(["internal", "external", "both"] as const).map((s) => (
                <Chip
                  key={s}
                  label={s.charAt(0).toUpperCase() + s.slice(1)}
                  selected={source === s}
                  onClick={() => setSource(source === s ? null : s)}
                />
              ))}
            </div>
          </div>

          {/* Predictable */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Was this predictable?
            </label>
            <div className="flex gap-2">
              <Chip
                label="Yes"
                selected={predictable === true}
                onClick={() => setPredictable(predictable === true ? null : true)}
              />
              <Chip
                label="No"
                selected={predictable === false}
                onClick={() => setPredictable(predictable === false ? null : false)}
              />
            </div>
          </div>

          {step === 1 && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep(2)}
            >
              Even deeper (optional)
            </Button>
          )}
        </div>
      )}

      {step >= 2 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Expectation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              What story or expectation was attached?
            </label>
            <Textarea
              placeholder="I expected it to go differently..."
              value={expectation}
              onChange={(e) => setExpectation(e.target.value)}
              rows={2}
            />
          </div>

          {/* Inner language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              What were you saying to yourself?
            </label>
            <Textarea
              placeholder="The inner dialogue or feelings that came up..."
              value={innerLanguage}
              onChange={(e) => setInnerLanguage(e.target.value)}
              rows={2}
            />
          </div>

          {/* What helped */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              What helped shift your state?
            </label>
            <Textarea
              placeholder="A walk, reframing, talking to someone..."
              value={whatHelped}
              onChange={(e) => setWhatHelped(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Save */}
      {whatHappened.trim() && (
        <div className="pt-2">
          <Button
            variant={isCharge ? "charge" : "drain"}
            className="w-full"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : `Save ${type}`}
          </Button>
        </div>
      )}
    </div>
  );
}
