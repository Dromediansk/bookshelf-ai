import { router } from "expo-router";

import { BookForm, BookFormValues } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";
import type { Book } from "@/types/book";
import { randomUUID } from "expo-crypto";

export const AddBookScreen = () => {
  const { addBook } = useBooksStore();

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
      insightIds: [],
    };

    addBook(book);
    router.back();
  };

  return (
    <BookForm
      submitLabel="Save"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
};

export default AddBookScreen;
