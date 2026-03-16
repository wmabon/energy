import { getAllEntries } from "@/actions/entries";
import { TimelineView } from "@/components/timeline/timeline-view";

export default async function TimelinePage() {
  const entries = await getAllEntries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Timeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All your moments, in order
        </p>
      </div>

      <TimelineView entries={entries} />
    </div>
  );
}
