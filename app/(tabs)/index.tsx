import { Pressable, SectionList, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookCard } from "@/components/BookCard";
import { useBooksStore } from "@/store/booksStore";
import { sortBooksForList } from "@/utils/helpers";
import type { Book, BookStatus } from "@/types/book";
import BookSectionHeader from "@/components/BookSectionHeader";
import colors from "@/utils/colors";

type BookSection = {
  status: BookStatus;
  data: Book[];
};

export const LibraryScreen = () => {
  const { books, hasHydrated } = useBooksStore();
  const sortedBooks = sortBooksForList(books);

  const sections: BookSection[] = (() => {
    const orderedStatuses: BookStatus[] = ["reading", "to-read", "finished"];
    return orderedStatuses
      .map((status) => ({
        status,
        data: sortedBooks.filter((b) => b.status === status),
      }))
      .filter((section) => section.data.length > 0);
  })();

  return (
    <View className="relative flex-1 pt-screen px-2">
      <View className="px-2 pb-2">
        <Text className="text-lg font-sansMedium text-brand font-bold">
          {hasHydrated
            ? `${books.length} book${books.length === 1 ? "" : "s"}`
            : "Loading…"}
        </Text>
      </View>

      {!hasHydrated ? (
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-sm font-sans text-text-muted">
            Preparing your offline library…
          </Text>
        </View>
      ) : (
        <SectionList<Book, BookSection>
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-2 pb-24"
          stickySectionHeadersEnabled
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderSectionHeader={({ section }) => (
            <BookSectionHeader section={section} />
          )}
          renderItem={({ item }) => <BookCard book={item} />}
          ListEmptyComponent={() => (
            <View className="mt-10 items-center">
              <Text className="text-base font-sansMedium text-text">
                No books yet
              </Text>
              <Text className="mt-2 text-sm font-sans text-text-muted">
                Add your first book to start tracking.
              </Text>
            </View>
          )}
        />
      )}

      {hasHydrated && books.length > 0 ? (
        <View className="absolute bottom-6 left-0 right-0 px-4">
          <Pressable
            onPress={() => router.push("/insights/new")}
            className="rounded-control bg-brand px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Add a new insight"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Ionicons
                name="bulb"
                size={18}
                color={colors.text.inverse}
              />
              <Text className="text-center text-base font-sansSemibold text-text-inverse">
                New insight
              </Text>
            </View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default LibraryScreen;
