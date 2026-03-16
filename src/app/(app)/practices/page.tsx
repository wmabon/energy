import { getCyclePractices, getPracticeLogs } from "@/actions/practices";
import { getCurrentCycle } from "@/actions/cycles";
import { PracticesManager } from "@/components/practices/practices-manager";
import { getDayOfCycle } from "@/lib/utils";

export default async function PracticesPage() {
  const cycle = await getCurrentCycle();
  const practices = await getCyclePractices();

  // Get logs for each practice
  const practicesWithLogs = await Promise.all(
    practices.map(async (p) => {
      const logs = await getPracticeLogs(p.id);
      return { ...p, logs };
    })
  );

  const cycleDay = cycle ? getDayOfCycle(cycle.startDate) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Practices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {cycle
            ? `Three commitments for Cycle ${cycle.cycleNumber} — Day ${cycleDay}`
            : "Define three commitments to practice this cycle"}
        </p>
      </div>

      <PracticesManager practices={practicesWithLogs} />
    </div>
  );
}
