import { router } from "expo-router";

import { BookForm, BookFormValues } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";
import type { Book } from "@/types/book";

function makeId() {
  return `bk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const AddBookScreen = () => {
  const addBook = useBooksStore((s) => s.addBook);

  const handleSubmit = (values: BookFormValues) => {
    const nowIso = new Date().toISOString();

    const book: Book = {
      id: makeId(),
      title: values.title,
      author: values.author || "Unknown",
      genre: values.genre,
      status: values.status,
      createdAt: nowIso,
      notes: [],
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
