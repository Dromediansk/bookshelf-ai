import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book } from "@/types/book";

type BooksState = {
  books: Book[];
  hasHydrated: boolean;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Omit<Book, "id">>) => void;
  removeBook: (id: string) => void;
  setBooks: (books: Book[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const MOCK_BOOKS: Book[] = [
  {
    id: "bk_001",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    status: "reading",
    createdAt: "2025-12-01T09:00:00.000Z",
    description: "A thrilling sci-fi adventure about a lone astronaut.",
  },
  {
    id: "bk_002",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    status: "to-read",
    createdAt: "2025-11-20T18:30:00.000Z",
    description:
      "An epic fantasy tale of a gifted young musician and magician.",
  },
  {
    id: "bk_003",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Nonfiction",
    status: "read",
    createdAt: "2025-10-02T07:15:00.000Z",
    description: "A guide to building good habits and breaking bad ones.",
  },
  {
    id: "bk_004",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    status: "to-read",
    createdAt: "2025-12-10T12:00:00.000Z",
    description: "A science fiction saga set on the desert planet Arrakis.",
  },
];

export const useBooksStore = create<BooksState>()(
  persist(
    (set) => ({
      books: MOCK_BOOKS,
      hasHydrated: false,

      addBook: (book) =>
        set((state) => ({
          books: [book, ...state.books],
        })),

      updateBook: (id, updates) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updates } : book
          ),
        })),

      removeBook: (id) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        })),

      setBooks: (books) => set({ books }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "books-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ books: state.books }),
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHasHydrated(true);
      },
    }
  )
);
