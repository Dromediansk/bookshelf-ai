import { useMemo } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import type { Book } from "@/types/book";
import type { Insight } from "@/types/insight";
import {
  formatRelativeTime,
  isWithinLastNDays,
  sortByDateDesc,
} from "@/utils/helpers";
import { LAST_N_DAYS, TIMELINE_DAYS } from "@/utils/contants";

type TimelineEvent = {
  id: string;
  type: "insight" | "finished-book";
  createdAt: string;
  bookId: string;
  bookTitle: string;
};

const buildTimelineEvents = (
  books: Book[],
  insights: Insight[],
): TimelineEvent[] => {
  const bookById = new Map(books.map((book) => [book.id, book] as const));

  const insightEvents: TimelineEvent[] = insights.map((insight) => {
    const book = bookById.get(insight.bookId);

    return {
      id: `insight:${insight.id}`,
      type: "insight",
      createdAt: insight.createdAt,
      bookId: insight.bookId,
      bookTitle: book?.title ?? "Unknown Book",
    };
  });

  const finishedBookEvents: TimelineEvent[] = books
    .filter((book) => book.status === "finished")
    .map((book) => ({
      id: `book:${book.id}`,
      type: "finished-book",
      createdAt: book.updatedAt ?? book.finishedAt,
      bookId: book.id,
      bookTitle: book.title,
    }));

  return sortByDateDesc(
    [...insightEvents, ...finishedBookEvents],
    (e) => e.createdAt,
  );
};

export const TimelineScreen = () => {
  const { books, hasHydrated: booksHydrated } = useBooksStore();
  const { insights, hasHydrated: insightsHydrated } = useInsightsStore();

  const hasHydrated = booksHydrated && insightsHydrated;
  const nowMs = Date.now();

  const {
    events,
    recentInsights,
    recentFinishedBooks,
    mostRecentInsight,
    hasAnyData,
  } = useMemo(() => {
    const hasAnyData = books.length > 0 || insights.length > 0;

    const recentInsights = insights.filter((insight) =>
      isWithinLastNDays(insight.createdAt, LAST_N_DAYS, nowMs),
    );

    const recentFinishedBooks = books.filter(
      (book) =>
        book.status === "finished" &&
        book.finishedAt &&
        isWithinLastNDays(book.finishedAt, LAST_N_DAYS, nowMs),
    );

    const mostRecentInsight = sortByDateDesc(
      recentInsights,
      (n) => n.createdAt,
    )[0];

    const allEvents = buildTimelineEvents(books, insights);
    const events = allEvents.filter((event) =>
      isWithinLastNDays(event.createdAt, TIMELINE_DAYS, nowMs),
    );

    return {
      events,
      recentInsights,
      recentFinishedBooks,
      mostRecentInsight,
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

  const hasRecentData =
    recentInsights.length > 0 || recentFinishedBooks.length > 0;

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
                Last 3 months in your reading
              </Text>

              {!hasRecentData ? (
                <Text className="mt-3 text-sm font-sans text-text-muted">
                  Start reading and writing insights to see your summary.
                </Text>
              ) : (
                <View className="mt-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Insights written
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {recentInsights.length}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Books finished
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {recentFinishedBooks.length}
                    </Text>
                  </View>

                  <View className="mt-4">
                    <Text className="text-sm font-sans text-text-muted">
                      Most recent insight
                    </Text>
                    {!!mostRecentInsight ? (
                      <Text
                        className="mt-2 text-sm font-sans text-text"
                        numberOfLines={2}
                      >
                        {mostRecentInsight.content}
                      </Text>
                    ) : (
                      <Text className="mt-2 text-sm font-sans text-text-subtle">
                        No insights in the last 3 months.
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            <Text className="mt-6 mb-3 text-base font-sansSemibold text-text">
              Activity in the last {TIMELINE_DAYS} days
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const relative = formatRelativeTime(item.createdAt, nowMs);

          const description =
            item.type === "insight"
              ? `You wrote an insight • ${item.bookTitle}`
              : `You finished a book • ${item.bookTitle}`;

          return (
            <Pressable
              className="rounded-card border border-border bg-surface px-card py-card"
              onPress={() =>
                router.push({
                  pathname: "/books/[id]",
                  params: { id: item.bookId },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.bookTitle}`}
            >
              <Text className="text-sm font-sansSemibold text-text">
                {description}
              </Text>
              {!!relative && (
                <Text className="mt-2 text-xs font-sans text-text-muted">
                  {relative}
                </Text>
              )}
            </Pressable>
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
