export type EntryType = "charge" | "drain";
export type Source = "internal" | "external" | "both";

export type Entry = {
  id: string;
  userId: string;
  cycleId: string | null;
  entryDate: string;
  type: EntryType;
  whatHappened: string;
  source: Source | null;
  predictable: boolean | null;
  expectation: string | null;
  innerLanguage: string | null;
  whatHelped: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Shift = {
  id: string;
  userId: string;
  cycleId: string | null;
  focusingOn: string | null;
  expectationAttached: string | null;
  languageUsed: string | null;
  reframe: string | null;
  resetType: string | null;
  stateShifted: boolean | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Practice = {
  id: string;
  userId: string;
  cycleId: string;
  commitmentText: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type Cycle = {
  id: string;
  userId: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};
