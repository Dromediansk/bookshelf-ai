import { Text, View, Pressable } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookForm } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";

function normalizeId(id: string | string[] | undefined) {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export const EditBookScreen = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const bookId = normalizeId(params.id);

  const book = useBooksStore((s) => s.books.find((b) => b.id === bookId));
  const updateBook = useBooksStore((s) => s.updateBook);
  const removeBook = useBooksStore((s) => s.removeBook);

  function onDelete() {
    if (!book) return;
    removeBook(book.id);
    router.replace("/");
  }

  if (!bookId || !book) {
    return (
      <View className="flex-1 bg-surface py-screen">
        <View className="flex-1 items-center justify-center px-screen">
          <Text className="text-base font-sansMedium text-text">
            Book not found
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            The book you’re trying to edit no longer exists.
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
    <>
      <Stack.Screen
        options={{
          title: "Edit Book",
          headerRight: () => (
            <Pressable
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel="Delete book"
              hitSlop={10}
            >
              <Ionicons name="trash-outline" size={22} />
            </Pressable>
          ),
        }}
      />

      <BookForm
        submitLabel="Save"
        initialValues={{
          title: book.title,
          author: book.author,
          genre: book.genre,
          status: book.status,
        }}
        onSubmit={(values) => {
          updateBook(book.id, {
            title: values.title,
            author: values.author || "Unknown",
            genre: values.genre,
            status: values.status,
          });
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </>
  );
};

export default EditBookScreen;
