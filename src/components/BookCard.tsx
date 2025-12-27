import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

import type { Book } from "@/types/book";

const TailwindIonicons = cssInterop(Ionicons, {
  className: "style",
});

type BookCardProps = {
  book: Book;
};

export const BookCard = ({ book }: BookCardProps) => {
  const insightsCount = book.insightIds?.length ?? 0;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/books/[id]", params: { id: book.id } })
      }
      className="rounded-card border border-border bg-surface px-card py-card"
      accessibilityRole="button"
      accessibilityLabel={`View details for ${book.title}`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text
            className="text-base font-sansSemibold text-text"
            numberOfLines={2}
          >
            {book.title}
          </Text>
          <Text
            className="mt-2 text-sm font-sans text-text-muted"
            numberOfLines={1}
          >
            {book.author}
          </Text>
        </View>

        <View className="items-end justify-center">
          <Text
            className="text-md font-sans text-text-subtle"
            numberOfLines={1}
          >
            {book.genre}
          </Text>

          <View className="mt-2 flex-row items-center gap-1">
            <TailwindIonicons
              name="bulb-outline"
              size={14}
              className="text-text-subtle"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text className="text-sm font-sans text-text-muted">
              {insightsCount}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
