import { getAllEntries } from "@/actions/entries";
import { getRecentShifts } from "@/actions/shifts";
import { getCurrentCycle } from "@/actions/cycles";
import { PatternsSummary } from "@/components/patterns/patterns-summary";

export default async function PatternsPage() {
  const cycle = await getCurrentCycle();
  const entries = await getAllEntries(cycle?.id);
  const shifts = await getRecentShifts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patterns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What&apos;s emerging from your reflections
        </p>
      </div>

      <PatternsSummary entries={entries} shifts={shifts} />
    </div>
  );
}
