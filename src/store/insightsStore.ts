import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useBooksStore } from "@/store/booksStore";
import type { Insight } from "@/types/insight";
import { MOCK_INSIGHTS } from "mocks/insights";
import { randomUUID } from "expo-crypto";

type InsightInput = {
  content: string;
  tags?: string[] | string;
};

type InsightUpdates = {
  content?: string;
  tags?: string[] | string;
};

type InsightsState = {
  insights: Insight[];
  hasHydrated: boolean;
  addInsight: (bookId: string, insight: InsightInput) => void;
  updateInsight: (
    bookId: string,
    insightId: string,
    updates: InsightUpdates
  ) => void;
  deleteInsight: (bookId: string, insightId: string) => void;
  setInsights: (insights: Insight[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  getInsightsByBookId: (bookId: string) => Insight[];
  getInsightsByIds: (ids: string[]) => Insight[];
};

function normalizeTags(tags: string[] | string | undefined): string[] {
  const values = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",")
      : [];

  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

export const useInsightsStore = create<InsightsState>()(
  persist(
    (set, get) => ({
      insights: MOCK_INSIGHTS,
      hasHydrated: false,

      setInsights: (insights) => set({ insights }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      getInsightsByBookId: (bookId) =>
        get().insights.filter((insight) => insight.bookId === bookId),

      getInsightsByIds: (ids) => {
        if (!ids.length) return [];
        const idSet = new Set(ids);
        return get().insights.filter((insight) => idSet.has(insight.id));
      },

      addInsight: (bookId, insight) => {
        const content = insight.content.trim();
        if (!content) return;

        const nowIso = new Date().toISOString();

        const newInsight: Insight = {
          id: randomUUID(),
          bookId,
          content,
          tags: normalizeTags(insight.tags),
          createdAt: nowIso,
        };

        set((state) => ({
          insights: [newInsight, ...state.insights],
        }));

        // Attach the insight id to the book.
        useBooksStore.setState((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const existing = Array.isArray(book.insightIds)
              ? book.insightIds
              : [];
            if (existing.includes(newInsight.id)) return book;
            return {
              ...book,
              insightIds: [...existing, newInsight.id],
              updatedAt: nowIso,
            };
          }),
        }));
      },

      updateInsight: (bookId, insightId, updates) => {
        const nextContent =
          typeof updates.content === "string"
            ? updates.content.trim()
            : undefined;

        set((state) => ({
          insights: state.insights.map((insight) => {
            if (insight.id !== insightId) return insight;
            if (insight.bookId !== bookId) return insight;

            return {
              ...insight,
              content:
                nextContent && nextContent.length > 0
                  ? nextContent
                  : insight.content,
              tags:
                updates.tags === undefined
                  ? insight.tags
                  : normalizeTags(updates.tags),
            };
          }),
        }));
      },

      deleteInsight: (bookId, insightId) => {
        const nowIso = new Date().toISOString();

        // 1) Remove the insight content from the global insights list.
        set((state) => ({
          insights: state.insights.filter(
            (insight) => insight.id !== insightId
          ),
        }));

        // 2) Detach the reference from the book.
        useBooksStore.setState((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const existing = Array.isArray(book.insightIds)
              ? book.insightIds
              : [];
            if (!existing.includes(insightId)) return book;
            return {
              ...book,
              insightIds: existing.filter((id) => id !== insightId),
              updatedAt: nowIso,
            };
          }),
        }));
      },
    }),
    {
      name: "insights-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ insights: state.insights }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
