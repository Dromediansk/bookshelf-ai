import { router } from "expo-router";

import { BookForm } from "@/components/BookForm";
import { useBooksStore } from "@/store/booksStore";
import type { Book } from "@/types/book";

function makeId() {
  return `bk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function AddBookScreen() {
  const addBook = useBooksStore((s) => s.addBook);

  return (
    <BookForm
      screenTitle="Add Book"
      screenSubtitle="Start with the book name. You can fill the rest manually."
      submitLabel="Save"
      onSubmit={(values) => {
        const nowIso = new Date().toISOString();

        const book: Book = {
          id: makeId(),
          title: values.title,
          author: values.author || "Unknown",
          genre: values.genre || "Unknown",
          status: values.status,
          createdAt: nowIso,
        };

        addBook(book);
        router.back();
      }}
      onCancel={() => router.back()}
    />
  );
}
