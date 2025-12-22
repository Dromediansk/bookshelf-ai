import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
