"use server";

import { db, initPromise } from "@/lib/db";
import { cycles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { auth } from "@/lib/auth";
import type { ActionResult, Cycle } from "@/types";

export async function getCurrentCycle(): Promise<Cycle | null> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return null;

  const rows = await db
    .select()
    .from(cycles)
    .where(eq(cycles.userId, session.user.id))
    .orderBy(desc(cycles.cycleNumber))
    .limit(1);

  return (rows[0] as Cycle) ?? null;
}

export async function createCycle(): Promise<ActionResult<Cycle>> {
  await initPromise;
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const latest = await db
    .select()
    .from(cycles)
    .where(eq(cycles.userId, session.user.id))
    .orderBy(desc(cycles.cycleNumber))
    .limit(1);

  const cycleNumber = latest[0] ? latest[0].cycleNumber + 1 : 1;
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const id = uuid();
  await db.insert(cycles).values({
    id,
    userId: session.user.id,
    cycleNumber,
    startDate,
    endDate,
  });

  const rows = await db.select().from(cycles).where(eq(cycles.id, id));
  return { success: true, data: rows[0] as Cycle };
}

export async function getOrCreateCycle(): Promise<Cycle> {
  const existing = await getCurrentCycle();
  if (existing) {
    const endDate = new Date(existing.endDate);
    if (endDate >= new Date()) {
      return existing;
    }
  }
  const result = await createCycle();
  return result.data!;
}
