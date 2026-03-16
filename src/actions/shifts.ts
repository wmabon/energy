"use server";

import { db, initPromise } from "@/lib/db";
import { shifts } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { getOrCreateCycle } from "./cycles";
import type { ActionResult, Shift } from "@/types";

export async function createShift(formData: FormData): Promise<ActionResult<Shift>> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const cycle = await getOrCreateCycle();
  const id = uuid();

  await db.insert(shifts).values({
    id,
    userId: session.user.id,
    cycleId: cycle.id,
    focusingOn: (formData.get("focusingOn") as string)?.trim() || null,
    expectationAttached: (formData.get("expectationAttached") as string)?.trim() || null,
    languageUsed: (formData.get("languageUsed") as string)?.trim() || null,
    reframe: (formData.get("reframe") as string)?.trim() || null,
    resetType: (formData.get("resetType") as string)?.trim() || null,
    stateShifted: formData.get("stateShifted") === "true" ? true : formData.get("stateShifted") === "false" ? false : null,
    notes: (formData.get("notes") as string)?.trim() || null,
  });

  const rows = await db.select().from(shifts).where(eq(shifts.id, id));
  return { success: true, data: rows[0] as Shift };
}

export async function getRecentShifts(): Promise<Shift[]> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.userId, session.user.id),
        isNull(shifts.deletedAt)
      )
    )
    .orderBy(desc(shifts.createdAt))
    .limit(20) as Shift[];
}
