"use server";

import { db, initPromise } from "@/lib/db";
import { entries } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { getOrCreateCycle } from "./cycles";
import type { ActionResult, Entry } from "@/types";
import { todayDateString } from "@/lib/utils";

export async function createEntry(formData: FormData): Promise<ActionResult<Entry>> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const type = formData.get("type") as "charge" | "drain";
  const whatHappened = formData.get("whatHappened") as string;

  if (!type || !whatHappened?.trim()) {
    return { success: false, error: "Type and description are required" };
  }

  const cycle = await getOrCreateCycle();
  const id = uuid();

  await db.insert(entries).values({
    id,
    userId: session.user.id,
    cycleId: cycle.id,
    entryDate: todayDateString(),
    type,
    whatHappened: whatHappened.trim(),
    source: (formData.get("source") as "internal" | "external" | "both") || null,
    predictable: formData.get("predictable") === "true" ? true : formData.get("predictable") === "false" ? false : null,
    expectation: (formData.get("expectation") as string)?.trim() || null,
    innerLanguage: (formData.get("innerLanguage") as string)?.trim() || null,
    whatHelped: (formData.get("whatHelped") as string)?.trim() || null,
  });

  const rows = await db.select().from(entries).where(eq(entries.id, id));
  return { success: true, data: rows[0] as Entry };
}

export async function getTodayEntries(): Promise<Entry[]> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return [];

  const today = todayDateString();
  return await db
    .select()
    .from(entries)
    .where(
      and(
        eq(entries.userId, session.user.id),
        eq(entries.entryDate, today),
        isNull(entries.deletedAt)
      )
    )
    .orderBy(desc(entries.createdAt)) as Entry[];
}

export async function getAllEntries(cycleId?: string): Promise<Entry[]> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return [];

  const conditions = [
    eq(entries.userId, session.user.id),
    isNull(entries.deletedAt),
  ];

  if (cycleId) {
    conditions.push(eq(entries.cycleId, cycleId));
  }

  return await db
    .select()
    .from(entries)
    .where(and(...conditions))
    .orderBy(desc(entries.createdAt)) as Entry[];
}

export async function deleteEntry(id: string): Promise<ActionResult> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await db.update(entries)
    .set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .where(and(eq(entries.id, id), eq(entries.userId, session.user.id)));

  return { success: true };
}
