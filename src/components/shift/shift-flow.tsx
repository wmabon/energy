"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShift } from "@/actions/shifts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chip } from "@/components/ui/chip";

const RESET_OPTIONS = [
  "Three deep breaths",
  "Step outside",
  "Cold water on face",
  "5-minute walk",
  "Stretch",
  "Change environment",
];

const steps = [
  { key: "focusingOn", question: "What are you focusing on right now?", placeholder: "The thing that has your attention..." },
  { key: "expectationAttached", question: "What expectation are you attached to?", placeholder: "How you think it should be going..." },
  { key: "languageUsed", question: "What are you saying to yourself?", placeholder: "The inner narrative running..." },
  { key: "reframe", question: "Can you see it differently?", placeholder: "A kinder or truer way to frame this..." },
  { key: "reset", question: "Pick a reset", placeholder: "" },
  { key: "result", question: "Did your state shift?", placeholder: "" },
] as const;

export function ShiftFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({
    focusingOn: "",
    expectationAttached: "",
    languageUsed: "",
    reframe: "",
    resetType: "",
    stateShifted: null as boolean | null,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const step = steps[currentStep];

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.set("focusingOn", values.focusingOn);
    formData.set("expectationAttached", values.expectationAttached);
    formData.set("languageUsed", values.languageUsed);
    formData.set("reframe", values.reframe);
    formData.set("resetType", values.resetType);
    if (values.stateShifted !== null) {
      formData.set("stateShifted", String(values.stateShifted));
    }
    formData.set("notes", values.notes);

    const result = await createShift(formData);
    if (result.success) {
      router.push("/today");
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {currentStep > 0 ? "Back" : "Cancel"}
        </button>
        <h1 className="text-lg font-semibold text-shift">Shift Now</h1>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-shift"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
        />
      </div>

      {/* Step content */}
      <div className="min-h-[200px] space-y-4 animate-in fade-in duration-300" key={currentStep}>
        <h2 className="text-xl font-semibold leading-tight">{step.question}</h2>

        {step.key === "reset" ? (
          <div className="flex flex-wrap gap-2">
            {RESET_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                selected={values.resetType === option}
                onClick={() => setValue("resetType", option)}
                variant="shift"
              />
            ))}
          </div>
        ) : step.key === "result" ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Chip
                label="Yes, it shifted"
                selected={values.stateShifted === true}
                onClick={() => setValues({ ...values, stateShifted: true })}
                variant="shift"
              />
              <Chip
                label="Not yet"
                selected={values.stateShifted === false}
                onClick={() => setValues({ ...values, stateShifted: false })}
              />
            </div>
            <Textarea
              placeholder="Any notes about this shift..."
              value={values.notes}
              onChange={(e) => setValue("notes", e.target.value)}
              rows={3}
            />
          </div>
        ) : (
          <Textarea
            placeholder={step.placeholder}
            value={values[step.key as keyof typeof values] as string}
            onChange={(e) => setValue(step.key, e.target.value)}
            autoFocus
            rows={4}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="pt-4">
        {currentStep < steps.length - 1 ? (
          <Button variant="shift" className="w-full" size="lg" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button
            variant="shift"
            className="w-full"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Complete shift"}
          </Button>
        )}
      </div>

      {/* Calming message */}
      {step.key === "reset" && values.resetType && (
        <p className="text-center text-sm text-muted-foreground animate-in fade-in duration-500">
          Take a moment. There&apos;s no rush.
        </p>
      )}
    </div>
  );
}
