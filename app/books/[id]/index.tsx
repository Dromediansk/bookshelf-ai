import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

import { StatusBadge } from "@/components/StatusBadge";
import { useBooksStore } from "@/store/booksStore";
import { NotesSection } from "@/components/NotesSection";
import { AboutBookModal } from "@/components/AboutBookModal";
import { useState } from "react";
import { formatCreatedAt } from "@/utils/helpers";

type BookDetailScreenParams = {
  id: string;
};

const TailwindIonicons = cssInterop(Ionicons, { className: "style" });

export const BookDetailScreen = () => {
  const params = useLocalSearchParams<BookDetailScreenParams>();
  const bookId = params.id;

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);

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

  const { id, title, author, genre, status, description, createdAt } = book;

  const createdAtLabel = formatCreatedAt(createdAt);

  return (
    <View className="flex-1 bg-surface-muted ">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Pressable
              onPress={openAbout}
              accessibilityRole="button"
              accessibilityLabel="Open about book"
              hitSlop={10}
              style={{ flexShrink: 1 }}
            >
              <Text
                numberOfLines={1}
                className="text-xl font-sansSemibold text-text"
                style={{ flexShrink: 1 }}
              >
                {title}
              </Text>
            </Pressable>
          ),
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

      <View className="flex-1">
        <View className="border border-border bg-brand-subtle px-card py-card">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              {!!author?.trim() && (
                <Text className="mt-2 text-lg font-sans text-text-muted">
                  Book by {author}
                </Text>
              )}
            </View>

            <View className="flex-row items-center gap-4 mt-2">
              <StatusBadge status={status} />

              <Pressable
                onPress={openAbout}
                accessibilityRole="button"
                accessibilityLabel="About the book"
                hitSlop={10}
              >
                <TailwindIonicons
                  name="information-circle-outline"
                  size={22}
                  className="text-text-subtle"
                />
              </Pressable>
            </View>
          </View>

          <View className="mt-2 flex-row items-center justify-between gap-3">
            <View className="rounded-full border border-brand bg-surface px-card">
              <Text className="text-sm font-sansSemibold text-text py-2">
                {genre === "Unknown" ? "Genre: Not set" : `Genre: ${genre}`}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-sm font-sans text-text-muted">
                Created: {createdAtLabel}
              </Text>
            </View>
          </View>
        </View>

        <AboutBookModal
          visible={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
          title={title}
          author={author}
          description={description}
        />

        <NotesSection book={book} />
      </View>
    </View>
  );
};

export default BookDetailScreen;
