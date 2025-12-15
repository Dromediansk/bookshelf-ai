import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

import { StatusBadge } from "@/components/StatusBadge";
import { useBooksStore } from "@/store/booksStore";
import { NotesSection } from "@/components/NotesSection";
import { AboutBookModal } from "@/components/AboutBookModal";
import { useState } from "react";

type BookDetailScreenParams = {
  id: string;
};

const TailwindIonicons = cssInterop(Ionicons, { className: "style" });

export const BookDetailScreen = () => {
  const params = useLocalSearchParams<BookDetailScreenParams>();
  const bookId = params.id;

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const { getBookById } = useBooksStore();
  const book = getBookById(bookId);

  if (!bookId || !book) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
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
    <View className="flex-1 bg-surface-muted py-2">
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

      <View className="flex-1 px-2">
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

          <View className="mt-4 flex-row items-center justify-between gap-3">
            <View className="rounded-full border border-brand bg-surface px-card py-2">
              <Text className="text-sm font-sansSemibold text-text">
                {genre === "Unknown" ? "Genre: Not set" : `Genre: ${genre}`}
              </Text>
            </View>

            <Pressable
              onPress={() => setIsAboutOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="About the book"
              hitSlop={10}
            >
              <TailwindIonicons
                name="information-circle-outline"
                size={22}
                className="text-brand"
              />
            </Pressable>
          </View>
        </View>

        <AboutBookModal
          visible={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          description={description}
        />

        <NotesSection book={book} />
      </View>
    </View>
  );
};

export default BookDetailScreen;
