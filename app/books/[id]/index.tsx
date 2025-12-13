import { Pressable, ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { StatusBadge } from "@/components/StatusBadge";
import { useBooksStore } from "@/store/booksStore";

function normalizeId(id: string | string[] | undefined) {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export const BookDetailScreen = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = normalizeId(params.id);

  const book = useBooksStore((s) => s.books.find((b) => b.id === bookId));

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

  return (
    <View className="flex-1 bg-surface py-screen">
      <Stack.Screen
        options={{
          title: book.title,
          headerRight: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/books/[id]/edit",
                  params: { id: book.id },
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

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-screen py-screen"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xl font-sansSemibold text-text">
              {book.title}
            </Text>
            <Text className="mt-2 text-sm font-sans text-text-muted">
              {book.author}
            </Text>
          </View>
          <StatusBadge status={book.status} />
        </View>

        <View className="mt-6">
          <Text className="text-sm font-sansMedium text-text">Genre</Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            {book.genre}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-sm font-sansMedium text-text">
            About the book
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            {book.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookDetailScreen;
