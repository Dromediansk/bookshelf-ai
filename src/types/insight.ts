export type Insight = {
  id: string;
  bookId: string;
  tags: string[];
  content: string;
  createdAt: string;
};

export const INSIGHT_MODES = ["none", "add", "edit"] as const;
export type InsightMode = (typeof INSIGHT_MODES)[number];
