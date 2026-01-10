import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookForm, type BookFormHandle } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";
import themeColors from "@/utils/colors";

type EditBookScreenParams = {
  id: string;
};

export const EditBookScreen = () => {
  const params = useLocalSearchParams<EditBookScreenParams>();
  const bookId = params.id;

  const formRef = useRef<BookFormHandle>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const { getBookById, updateBook } = useBooksStore();
  const book = getBookById(bookId);

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
          title: book.title,
          headerRight: ({ tintColor }) => (
            <Pressable
              onPress={() => formRef.current?.submit()}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
              hitSlop={10}
              style={{ opacity: canSubmit ? 1 : 0.4 }}
            >
              <Ionicons
                name="checkmark"
                size={24}
                color={
                  canSubmit
                    ? (tintColor ?? themeColors.text.DEFAULT)
                    : themeColors.text.muted
                }
              />
            </Pressable>
          ),
        }}
      />

      <BookForm
        ref={formRef}
        onCanSubmitChange={setCanSubmit}
        initialValues={{
          title: book.title,
          author: book.author,
          genre: book.genre,
          status: book.status,
          description: book.description ?? "",
          createdAt: book.createdAt,
          finishedAt: book.finishedAt ?? undefined,
        }}
        onSubmit={(values) => {
          updateBook(book.id, {
            title: values.title,
            author: values.author || "Unknown",
            genre: values.genre,
            status: values.status,
            description: values.description.trim() || undefined,
            createdAt: values.createdAt,
            finishedAt: values.finishedAt,
          });
          router.back();
        }}
      />
    </>
  );
};

export default EditBookScreen;
