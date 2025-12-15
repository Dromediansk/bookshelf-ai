import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { StatusBadge } from "@/components/StatusBadge";
import { useBooksStore } from "@/store/booksStore";
import { NotesSection } from "@/components/NotesSection";

type BookDetailScreenParams = {
  id: string;
};

export const BookDetailScreen = () => {
  const params = useLocalSearchParams<BookDetailScreenParams>();
  const bookId = params.id;

  const { getBookById } = useBooksStore();
  const book = getBookById(bookId);

  if (!bookId || !book) {
    return (
      <View className="flex-1 bg-surface py-screen">
        <View className="flex-1 items-center justify-center px-screen">
          <Text className="text-base font-sansMedium text-text">
            Book not found
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            The book you’re looking for no longer exists.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-control bg-brand px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text className="text-center text-base font-sansSemibold text-text-inverse">
              Go back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { id, title, author, genre, status, description } = book;

  return (
    <View className="flex-1 bg-surface-muted py-screen">
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/books/[id]/edit",
                  params: { id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Edit book"
              hitSlop={10}
            >
              <Ionicons name="create-outline" size={22} />
            </Pressable>
          ),
        }}
      />

      <View className="flex-1 px-screen py-screen">
        <View className="rounded-card border border-border bg-brand-subtle px-card py-card">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-2xl font-sansBold text-text">{title}</Text>
              {!!author?.trim() && (
                <Text className="mt-2 text-sm font-sans text-text-muted">
                  {author}
                </Text>
              )}
            </View>
            <StatusBadge status={status} />
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            <View className="rounded-full border border-brand bg-surface px-card py-2">
              <Text className="text-sm font-sansSemibold text-text">
                {genre === "Unknown" ? "Genre: Not set" : `Genre: ${genre}`}
              </Text>
            </View>
          </View>
        </View>

        {description && (
          <View className="mt-6 rounded-card border border-border bg-surface px-card py-card">
            <Text className="text-sm font-sansMedium text-brand">
              About the book
            </Text>
            <View className="mt-3 border-l-4 border-brand pl-3">
              <Text className="text-sm font-sans text-text-muted">
                {description}
              </Text>
            </View>
          </View>
        )}

        <NotesSection book={book} />
      </View>
    </View>
  );
};

export default BookDetailScreen;
