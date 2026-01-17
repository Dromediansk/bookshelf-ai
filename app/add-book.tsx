import { useRef, useState } from "react";
import IconButton from "@/components/shared/IconButton";
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
            <IconButton
              onPress={() => formRef.current?.submit()}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Save book"
              icon="checkmark"
              tintColor={
                canSubmit
                  ? (tintColor ?? themeColors.text.DEFAULT)
                  : themeColors.text.muted
              }
              style={{ opacity: canSubmit ? 1 : 0.4 }}
            />
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
