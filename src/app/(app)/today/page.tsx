import { auth } from "@/lib/auth";
import { getTodayEntries } from "@/actions/entries";
import { getCurrentCycle } from "@/actions/cycles";
import { getCyclePractices } from "@/actions/practices";
import { getGreeting, getDayOfCycle } from "@/lib/utils";
import { TodayActions } from "@/components/today/today-actions";
import { TodayEntries } from "@/components/today/today-entries";
import { CycleProgress } from "@/components/today/cycle-progress";
import { ActivePractices } from "@/components/today/active-practices";

export default async function TodayPage() {
  const session = await auth();
  const entries = await getTodayEntries();
  const cycle = await getCurrentCycle();
  const practices = await getCyclePractices();
  const name = session?.user?.name || "there";
  const cycleDay = cycle ? getDayOfCycle(cycle.startDate) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()}, {name}
        </h1>
        {cycle ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Day {cycleDay} of 30 — Cycle {cycle.cycleNumber}
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            Start your first cycle by logging an entry
          </p>
        )}
      </div>

      {/* Cycle progress ring */}
      {cycle && <CycleProgress day={cycleDay} total={30} />}

      {/* Action buttons */}
      <TodayActions />

      {/* Today's entries */}
      <TodayEntries entries={entries} />

      {/* Active practices */}
      {practices.length > 0 && <ActivePractices practices={practices} />}
    </div>
  );
}
