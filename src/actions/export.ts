"use server";

import { db, initPromise } from "@/lib/db";
import { entries, shifts, practices, practiceLogs, cycles, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/types";

export async function exportAllData(): Promise<ActionResult<string>> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const userId = session.user.id;

  const userRows = await db.select().from(users).where(eq(users.id, userId));
  const userData = userRows[0];
  const userCycles = await db.select().from(cycles).where(eq(cycles.userId, userId));
  const userEntries = await db
    .select()
    .from(entries)
    .where(and(eq(entries.userId, userId), isNull(entries.deletedAt)));
  const userShifts = await db
    .select()
    .from(shifts)
    .where(and(eq(shifts.userId, userId), isNull(shifts.deletedAt)));
  const userPractices = await db
    .select()
    .from(practices)
    .where(eq(practices.userId, userId));

  const allLogs = [];
  for (const practice of userPractices) {
    const logs = await db
      .select()
      .from(practiceLogs)
      .where(eq(practiceLogs.practiceId, practice.id));
    allLogs.push(...logs);
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: userData,
    cycles: userCycles,
    entries: userEntries,
    shifts: userShifts,
    practices: userPractices,
    practiceLogs: allLogs,
  };

  return { success: true, data: JSON.stringify(exportData, null, 2) };
}

export async function deleteAllData(): Promise<ActionResult> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const userId = session.user.id;

  const userPractices = await db
    .select()
    .from(practices)
    .where(eq(practices.userId, userId));

  for (const practice of userPractices) {
    await db.delete(practiceLogs)
      .where(eq(practiceLogs.practiceId, practice.id));
  }

  await db.delete(practices).where(eq(practices.userId, userId));
  await db.delete(shifts).where(eq(shifts.userId, userId));
  await db.delete(entries).where(eq(entries.userId, userId));
  await db.delete(cycles).where(eq(cycles.userId, userId));

  return { success: true };
}
