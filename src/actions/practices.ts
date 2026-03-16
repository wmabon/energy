"use server";

import { db, initPromise } from "@/lib/db";
import { practices, practiceLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import { getOrCreateCycle } from "./cycles";
import type { ActionResult, Practice } from "@/types";
import { todayDateString } from "@/lib/utils";

export async function getCyclePractices(): Promise<Practice[]> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return [];

  const cycle = await getOrCreateCycle();

  return await db
    .select()
    .from(practices)
    .where(
      and(
        eq(practices.userId, session.user.id),
        eq(practices.cycleId, cycle.id)
      )
    )
    .orderBy(practices.position) as Practice[];
}

export async function savePractice(formData: FormData): Promise<ActionResult<Practice>> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const commitmentText = formData.get("commitmentText") as string;
  const position = parseInt(formData.get("position") as string);
  const practiceId = formData.get("id") as string;

  if (!commitmentText?.trim()) {
    return { success: false, error: "Commitment text is required" };
  }

  const cycle = await getOrCreateCycle();

  if (practiceId) {
    await db.update(practices)
      .set({
        commitmentText: commitmentText.trim(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(practices.id, practiceId));

    const rows = await db.select().from(practices).where(eq(practices.id, practiceId));
    return { success: true, data: rows[0] as Practice };
  }

  const id = uuid();
  await db.insert(practices).values({
    id,
    userId: session.user.id,
    cycleId: cycle.id,
    commitmentText: commitmentText.trim(),
    position,
  });

  const rows = await db.select().from(practices).where(eq(practices.id, id));
  return { success: true, data: rows[0] as Practice };
}

export async function logPractice(formData: FormData): Promise<ActionResult> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const practiceId = formData.get("practiceId") as string;
  const notes = formData.get("notes") as string;

  if (!practiceId) {
    return { success: false, error: "Practice ID is required" };
  }

  const id = uuid();
  await db.insert(practiceLogs).values({
    id,
    practiceId,
    loggedDate: todayDateString(),
    notes: notes?.trim() || null,
  });

  return { success: true };
}

export async function getPracticeLogs(practiceId: string) {
  await initPromise;
  return await db
    .select()
    .from(practiceLogs)
    .where(eq(practiceLogs.practiceId, practiceId))
    .orderBy(desc(practiceLogs.createdAt));
}
