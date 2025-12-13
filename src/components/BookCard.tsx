import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import type { Book } from "@/types/book";
import { StatusBadge } from "@/components/StatusBadge";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/edit-book", params: { id: book.id } })
      }
      className="rounded-card border border-border bg-surface px-card py-card"
      accessibilityRole="button"
      accessibilityLabel={`Edit ${book.title}`}
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
            className="mt-1 text-sm font-sans text-text-muted"
            numberOfLines={1}
          >
            {book.author}
          </Text>
          <Text
            className="mt-1 text-xs font-sans text-text-subtle"
            numberOfLines={1}
          >
            {book.genre}
          </Text>
        </View>

        <StatusBadge status={book.status} />
      </View>
    </Pressable>
  );
}
