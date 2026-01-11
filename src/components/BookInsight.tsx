import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import { Insight } from "@/types/insight";
import { toTime } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FC } from "react";
import { Alert, Pressable, Text, View } from "react-native";

type BookInsightProps = {
  bookId: string;
  insight: Insight;
};

function formatInsightDate(value: string | undefined) {
  const time = toTime(value);
  if (!time) return undefined;

  return new Date(time).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BookInsight: FC<BookInsightProps> = ({ bookId, insight }) => {
  const { hasHydrated } = useBooksStore();
  const { deleteInsight } = useInsightsStore();

  const dateLabel = formatInsightDate(insight.createdAt);

  return (
    <Pressable
      key={insight.id}
      onPress={() =>
        router.push({
          pathname: "/books/[id]/insights/[insightId]/edit",
          params: { id: bookId, insightId: insight.id },
        })
      }
      disabled={!hasHydrated}
      className="rounded-card border border-border bg-surface-muted px-card py-card"
      accessibilityRole="button"
      accessibilityLabel="Edit insight"
    >
      <View className={hasHydrated ? undefined : "opacity-60"}>
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-sm font-sans text-text">
            {insight.content}
          </Text>
          {dateLabel ? (
            <Text className="text-xs font-sans text-text-subtle">
              {dateLabel}
            </Text>
          ) : null}
        </View>

        <View className="mt-3 flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row flex-wrap gap-2">
            {insight.tags?.map((tag) => (
              <View
                key={`${insight.id}:${tag}`}
                className="rounded-full border border-border bg-surface px-2 py-1"
              >
                <Text className="text-xs font-sansMedium text-text">{tag}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={(event) => {
              event.stopPropagation?.();
              if (!hasHydrated) return;

              Alert.alert("Delete insight?", "This action can’t be undone.", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deleteInsight(bookId, insight.id),
                },
              ]);
            }}
            disabled={!hasHydrated}
            className={
              hasHydrated
                ? "rounded-control border border-border bg-surface p-2"
                : "rounded-control border border-border bg-surface-muted p-2"
            }
            accessibilityRole="button"
            accessibilityLabel="Delete insight"
          >
            <Ionicons name="trash-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default BookInsight;
