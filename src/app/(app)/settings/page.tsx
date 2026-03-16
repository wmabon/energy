import { auth } from "@/lib/auth";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default async function SettingsPage() {
  const session = await auth();
  const email = session?.user?.email || "";
  const name = session?.user?.name || "";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsPanel email={email} name={name} />
    </div>
  );
}
