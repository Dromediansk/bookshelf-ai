import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import type { Book } from "@/types/book";
import type { Insight } from "@/types/insight";
import {
  formatRelativeTime,
  isWithinLastNDays,
  sortByDateDesc,
} from "@/utils/helpers";

type TimelineEvent = {
  id: string;
  type: "insight" | "finished-book";
  createdAt: string;
  bookTitle: string;
};

const LAST_N_DAYS = 7;

const buildTimelineEvents = (
  books: Book[],
  insights: Insight[]
): TimelineEvent[] => {
  const bookById = new Map(books.map((book) => [book.id, book] as const));

  const insightEvents: TimelineEvent[] = insights.map((insight) => {
    const book = bookById.get(insight.bookId);
    return {
      id: `insight:${insight.id}`,
      type: "insight",
      createdAt: insight.createdAt,
      bookTitle: book ? book.title : "Unknown book",
    };
  });

  const finishedBookEvents: TimelineEvent[] = books
    .filter((book) => book.status === "read")
    .map((book) => ({
      id: `book:${book.id}`,
      type: "finished-book",
      createdAt: book.updatedAt,
      bookTitle: book.title,
    }));

  return sortByDateDesc(
    [...insightEvents, ...finishedBookEvents],
    (e) => e.createdAt
  );
};

export const TimelineScreen = () => {
  const { books, hasHydrated: booksHydrated } = useBooksStore();
  const { insights, hasHydrated: insightsHydrated } = useInsightsStore();

  const hasHydrated = booksHydrated && insightsHydrated;
  const nowMs = Date.now();

  const {
    events,
    weeklyInsights,
    weeklyFinishedBooks,
    lastWeeklyInsight,
    hasAnyData,
  } = useMemo(() => {
    const hasAnyData = books.length > 0 || insights.length > 0;

    const weeklyInsights = insights.filter((insight) =>
      isWithinLastNDays(insight.createdAt, LAST_N_DAYS, nowMs)
    );

    const weeklyFinishedBooks = books.filter(
      (book) =>
        book.status === "read" &&
        isWithinLastNDays(book.updatedAt, LAST_N_DAYS, nowMs)
    );

    const lastWeeklyInsight = sortByDateDesc(
      weeklyInsights,
      (n) => n.createdAt
    )[0];

    const events = buildTimelineEvents(books, insights);

    return {
      events,
      weeklyInsights,
      weeklyFinishedBooks,
      lastWeeklyInsight,
      hasAnyData,
    };
  }, [books, insights, nowMs]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center px-screen">
        <Text className="text-sm font-sans text-text-muted">
          Preparing your timeline…
        </Text>
      </View>
    );
  }

  const hasWeeklyData =
    weeklyInsights.length > 0 || weeklyFinishedBooks.length > 0;

  return (
    <View className="flex-1 bg-surface-muted py-screen">
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-screen pb-8"
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={() => (
          <View>
            <View className="rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-base font-sansSemibold text-text">
                This week in your reading
              </Text>

              {!hasWeeklyData ? (
                <Text className="mt-3 text-sm font-sans text-text-muted">
                  Start reading and writing insights to see your weekly summary.
                </Text>
              ) : (
                <View className="mt-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Insights written
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {weeklyInsights.length}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Books finished
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {weeklyFinishedBooks.length}
                    </Text>
                  </View>

                  <View className="mt-4">
                    <Text className="text-sm font-sans text-text-muted">
                      Last insight this week
                    </Text>
                    {!!lastWeeklyInsight ? (
                      <Text
                        className="mt-2 text-sm font-sans text-text"
                        numberOfLines={2}
                      >
                        {lastWeeklyInsight.content}
                      </Text>
                    ) : (
                      <Text className="mt-2 text-sm font-sans text-text-subtle">
                        No insights yet this week.
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            <Text className="mt-6 text-base font-sansSemibold text-text">
              Activity
            </Text>

            <View className="h-3" />
          </View>
        )}
        renderItem={({ item }) => {
          const relative = formatRelativeTime(item.createdAt, nowMs);

          const description =
            item.type === "insight"
              ? item.bookTitle
                ? `You wrote a insight • ${item.bookTitle}`
                : "You wrote a insight"
              : `You finished a book • ${item.bookTitle}`;

          return (
            <View className="rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sansSemibold text-text">
                {description}
              </Text>
              {!!relative && (
                <Text className="mt-2 text-xs font-sans text-text-muted">
                  {relative}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return !hasAnyData ? (
            <View className="mt-3 rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sans text-text-muted">
                No activity yet.
              </Text>
              <Text className="mt-1 text-sm font-sans text-text-subtle">
                Add a book or write a insight to start your timeline.
              </Text>
            </View>
          ) : events.length === 0 ? (
            <View className="mt-3 rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sans text-text-muted">
                No recent activity to show.
              </Text>
              <Text className="mt-1 text-sm font-sans text-text-subtle">
                Write a insight or finish a book to see updates here.
              </Text>
            </View>
          ) : (
            <View className="h-3" />
          );
        }}
      />
    </View>
  );
};

export default TimelineScreen;
