import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import { Book } from "@/types/book";
import { toTime } from "@/utils/helpers";
import { router } from "expo-router";
import { FC } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import BookInsight from "./BookInsight";
import { Ionicons } from "@expo/vector-icons";
import themeColors from "@/utils/colors";

type InsightsSectionProps = {
  book: Book;
};

export const InsightsSection: FC<InsightsSectionProps> = ({ book }) => {
  const { id, insightIds } = book;
  const { hasHydrated } = useBooksStore();
  const { getInsightsByIds } = useInsightsStore();

  const insights = insightIds.length ? getInsightsByIds(insightIds) : [];

  const sortedInsights = [...insights].sort(
    (a, b) => toTime(b.createdAt) - toTime(a.createdAt)
  );

  const insightsCountLabel =
    sortedInsights.length === 1
      ? "1 Insight"
      : `${sortedInsights.length} Insights`;

  return (
    <View className="flex-1 border border-border bg-surface px-card py-card">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-md font-sansMedium text-brand font-bold">
          {insightsCountLabel}
        </Text>
      </View>

      {!hasHydrated ? (
        <Text className="mt-2 text-xs font-sans text-text-subtle">
          Loading your library…
        </Text>
      ) : null}

      {sortedInsights.length === 0 ? (
        <View className="mt-4 rounded-card border border-border bg-surface-muted px-card py-card">
          <Text className="text-sm font-sansSemibold text-text">
            No insights yet
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            Your personal insights and ideas for this book will show up here.
          </Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/books/[id]/insights/new",
                params: { id },
              })
            }
            disabled={!hasHydrated}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Add first insight"
            className={
              hasHydrated
                ? "mt-4 self-center rounded-control bg-brand px-3 py-2"
                : "mt-4 self-center rounded-control bg-surface px-3 py-2"
            }
          >
            <View className="flex-row gap-2">
              <Text
                className={
                  hasHydrated
                    ? "text-center text-sm font-sansSemibold text-text-inverse"
                    : "text-center text-sm font-sansSemibold text-text-subtle"
                }
              >
                Add first insight
              </Text>
              <Ionicons
                name="bulb"
                size={16}
                color={themeColors.text.inverse}
              />
            </View>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="mt-4 flex-1"
          contentContainerClassName="gap-3"
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {sortedInsights.map((insight) => {
            return (
              <BookInsight key={insight.id} bookId={id} insight={insight} />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
