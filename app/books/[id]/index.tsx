import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";

import { StatusBadge } from "@/components/StatusBadge";
import { useBooksStore } from "@/store/booksStore";
import { InsightsSection } from "@/components/InsightsSection";
import { AboutBookModal } from "@/components/AboutBookModal";
import { getBookDateLabelByPriority } from "@/utils/helpers";
import themeColors from "@/utils/colors";
import { HeaderTitle } from "@/components/shared/HeaderTitle";
import IconButton from "@/components/shared/IconButton";

type BookDetailScreenParams = {
  id: string;
};

export const BookDetailScreen = () => {
  const params = useLocalSearchParams<BookDetailScreenParams>();
  const bookId = params.id;

  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);

  const { showActionSheetWithOptions } = useActionSheet();

  const { getBookById, hasHydrated, removeBook } = useBooksStore();
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

  const dateLabel = getBookDateLabelByPriority(book);

  return (
    <View className="flex-1 bg-surface-muted ">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderTitle
              title={title}
              onPress={openAbout}
              accessibilityLabel="Open about book"
            />
          ),
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="ellipsis-vertical"
              accessibilityLabel="Open book menu"
              tintColor={tintColor}
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    options: ["Edit", "Delete", "Cancel"],
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 1,
                    title: "Book options",
                  },
                  (selectedIndex) => {
                    if (selectedIndex === 0) {
                      router.push({
                        pathname: "/books/[id]/edit",
                        params: { id },
                      });
                      return;
                    }

                    if (selectedIndex === 1) {
                      Alert.alert(
                        "Delete book?",
                        "This action can’t be undone.",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => {
                              removeBook(id);
                              router.replace("/");
                            },
                          },
                        ]
                      );
                    }
                  }
                );
              }}
            />
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

            <View className="flex-row items-center gap-2 mt-2">
              <StatusBadge status={status} />

              <IconButton
                onPress={openAbout}
                accessibilityLabel="About the book"
                icon="information-circle-outline"
                iconSize={22}
              />
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
                {dateLabel.label}: {dateLabel.value}
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

        <InsightsSection book={book} />

        <View className="absolute bottom-4 left-0 right-4">
          {book.insightIds.length > 0 && (
            <IconButton
              onPress={() =>
                router.push({
                  pathname: "/books/[id]/insights/new",
                  params: { id },
                })
              }
              disabled={!hasHydrated}
              accessibilityLabel="Add insight"
              icon="bulb"
              iconSize={28}
              tintColor={themeColors.text.inverse}
              className={
                hasHydrated
                  ? "absolute bottom-6 right-6 rounded-full bg-brand p-3"
                  : "absolute bottom-6 right-6 rounded-full bg-surface-muted p-3"
              }
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default BookDetailScreen;
