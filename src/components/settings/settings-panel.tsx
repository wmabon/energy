"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { exportAllData, deleteAllData } from "@/actions/export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";

type SettingsPanelProps = {
  email: string;
  name: string;
};

export function SettingsPanel({ email, name }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleExport() {
    setExporting(true);
    const result = await exportAllData();
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `energy-log-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await deleteAllData();
    setDeleting(false);
    setConfirmDelete(false);
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-sm">{name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm">{email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium cursor-pointer ${
                  theme === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting..." : "Export all data (JSON)"}
          </Button>
          <div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : confirmDelete
                ? "Confirm: delete everything"
                : "Delete all data"}
            </Button>
            {confirmDelete && !deleting && (
              <p className="mt-2 text-xs text-destructive">
                This will permanently delete all your entries, shifts, practices, and cycles. This cannot be undone.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add to Home Screen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add to Home Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For the best experience on iPhone, tap the share button in Safari, then
            &ldquo;Add to Home Screen.&rdquo; The app will feel native and stay
            signed in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
