import type { Practice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivePracticesProps = {
  practices: Practice[];
};

export function ActivePractices({ practices }: ActivePracticesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active practices</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {practices.map((practice) => (
            <li key={practice.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-shift/10 text-xs font-medium text-shift">
                {practice.position}
              </span>
              <span className="leading-relaxed">{practice.commitmentText}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
