import { Text, View, Pressable } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookForm } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";

type EditBookScreenParams = {
  id: string;
};

export const EditBookScreen = () => {
  const params = useLocalSearchParams<EditBookScreenParams>();
  const bookId = params.id;

  const { getBookById, updateBook, removeBook } = useBooksStore();
  const book = getBookById(bookId);

  function onDelete() {
    if (!book) return;
    removeBook(book.id);

    // Ensure we can't navigate back to the deleted book screens.
    router.replace("/");
  }

  if (!bookId || !book) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
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
          description: book.description ?? "",
        }}
        onSubmit={(values) => {
          updateBook(book.id, {
            title: values.title,
            author: values.author || "Unknown",
            genre: values.genre,
            status: values.status,
            description: values.description.trim() || undefined,
          });
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </>
  );
};

export default EditBookScreen;
