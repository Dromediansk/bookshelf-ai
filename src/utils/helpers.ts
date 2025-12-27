import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { Book } from "@/types/book";
import { BOOK_STATUS_PRIORITY } from "./contants";

dayjs.extend(relativeTime);

/**
 * Parse an ISO date string into epoch milliseconds.
 *
 * When to use:
 * - UI helpers and “good enough” comparisons where missing/invalid dates should behave like 0.
 * - Convenience sorting where you’re OK with missing/invalid dates being treated as the epoch.
 *
 * Insight:
 * - Because missing/invalid returns 0, this can unintentionally push items earlier/later depending on
 *   sort direction. If you need to explicitly place “unknown dates” last/first, prefer `toValidTime`.
 */
export const toTime = (value: string | undefined) => {
  if (!value) return 0;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return 0;
  return parsed.valueOf();
};

export const isWithinLastNDays = (
  value: string | undefined,
  days: number,
  nowMs: number = Date.now()
) => {
  if (days <= 0) return false;
  if (!value) return false;

  const now = dayjs(nowMs);
  const target = dayjs(value);
  if (!target.isValid()) return false;
  if (target.isAfter(now)) return false;

  const start = now.subtract(days, "day");
  return target.isAfter(start);
};

export const sortByDateDesc = <T>(
  items: T[],
  getDate: (item: T) => string | undefined
) => {
  return [...items].sort((a, b) => toTime(getDate(b)) - toTime(getDate(a)));
};

export const formatRelativeTime = (
  value: string | undefined,
  nowMs: number = Date.now()
) => {
  if (!value) return "";

  const now = dayjs(nowMs);
  const target = dayjs(value);
  if (!target.isValid()) return "";
  if (target.isAfter(now)) return "";

  return target.from(now);
};

export const formatCreatedAt = (
  createdAt: string | undefined,
  nowMs: number = Date.now()
) => {
  if (!createdAt) return "";

  const created = dayjs(createdAt);
  if (!created.isValid()) return "";

  if (isWithinLastNDays(createdAt, 3, nowMs)) {
    return formatRelativeTime(createdAt, nowMs);
  }

  return created.toDate().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Parse an ISO date string into epoch milliseconds, but preserve “missing/invalid” as `null`.
 *
 * When to use:
 * - Sorting where you must handle missing dates safely and intentionally.
 *   Example: `toValidTime(x) ?? Number.POSITIVE_INFINITY` to push missing dates to the end for ASC,
 *   or `?? Number.NEGATIVE_INFINITY` to push missing dates to the end for DESC.
 */
const toValidTime = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.valueOf();
};

const stableSort = <T>(
  items: readonly T[],
  compare: (a: T, b: T) => number
) => {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const cmp = compare(a.item, b.item);
      if (cmp !== 0) return cmp;
      return a.index - b.index;
    })
    .map(({ item }) => item);
};

export const sortBooksForList = (books: readonly Book[]): Book[] => {
  return stableSort(books, (a, b) => {
    const statusCmp =
      BOOK_STATUS_PRIORITY[a.status] - BOOK_STATUS_PRIORITY[b.status];
    if (statusCmp !== 0) return statusCmp;

    if (a.status === "to-read") {
      const aTime = toValidTime(a.createdAt) ?? Number.POSITIVE_INFINITY;
      const bTime = toValidTime(b.createdAt) ?? Number.POSITIVE_INFINITY;
      return aTime - bTime;
    }

    const aTime = toValidTime(a.updatedAt) ?? Number.NEGATIVE_INFINITY;
    const bTime = toValidTime(b.updatedAt) ?? Number.NEGATIVE_INFINITY;
    return bTime - aTime;
  });
};
