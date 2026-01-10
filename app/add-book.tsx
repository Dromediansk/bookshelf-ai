import { useRef, useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

import {
  BookForm,
  type BookFormHandle,
  BookFormValues,
} from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";
import type { Book } from "@/types/book";
import { randomUUID } from "expo-crypto";
import themeColors from "@/utils/colors";

export const AddBookScreen = () => {
  const { addBook } = useBooksStore();
  const formRef = useRef<BookFormHandle>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = (values: BookFormValues) => {
    const nowIso = new Date().toISOString();

    const book: Book = {
      id: randomUUID(),
      title: values.title,
      author: values.author || "Unknown",
      genre: values.genre,
      status: values.status,
      description: values.description.trim() || undefined,
      createdAt: values.createdAt || nowIso,
      updatedAt: nowIso,
      finishedAt: values.finishedAt ?? null,
      insightIds: [],
    };

    addBook(book);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: ({ tintColor }) => (
            <Pressable
              onPress={() => formRef.current?.submit()}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Save book"
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
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddBookScreen;
