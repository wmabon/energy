import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const cycles = sqliteTable("cycles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cycleNumber: integer("cycle_number").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const entries = sqliteTable("entries", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cycleId: text("cycle_id").references(() => cycles.id),
  entryDate: text("entry_date").notNull(),
  type: text("type", { enum: ["charge", "drain"] }).notNull(),
  whatHappened: text("what_happened").notNull(),
  source: text("source", { enum: ["internal", "external", "both"] }),
  predictable: integer("predictable", { mode: "boolean" }),
  expectation: text("expectation"),
  innerLanguage: text("inner_language"),
  whatHelped: text("what_helped"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

export const shifts = sqliteTable("shifts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cycleId: text("cycle_id").references(() => cycles.id),
  focusingOn: text("focusing_on"),
  expectationAttached: text("expectation_attached"),
  languageUsed: text("language_used"),
  reframe: text("reframe"),
  resetType: text("reset_type"),
  stateShifted: integer("state_shifted", { mode: "boolean" }),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

export const practices = sqliteTable("practices", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cycleId: text("cycle_id")
    .notNull()
    .references(() => cycles.id),
  commitmentText: text("commitment_text").notNull(),
  position: integer("position").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const practiceLogs = sqliteTable("practice_logs", {
  id: text("id").primaryKey(),
  practiceId: text("practice_id")
    .notNull()
    .references(() => practices.id),
  loggedDate: text("logged_date").notNull(),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});
