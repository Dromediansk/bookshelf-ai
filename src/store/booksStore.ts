import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book } from "@/types/book";
import { MOCK_BOOKS } from "mocks/books";

type BooksState = {
  books: Book[];
  hasHydrated: boolean;
  getBookById: (id: string) => Book | undefined;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Omit<Book, "id">>) => void;
  removeBook: (id: string) => void;
  setBooks: (books: Book[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useBooksStore = create<BooksState>()(
  persist(
    (set) => ({
      books: MOCK_BOOKS,
      hasHydrated: false,

      getBookById: (id: string): Book | undefined => {
        const state = useBooksStore.getState();
        return state.books.find((book) => book.id === id);
      },

      addBook: (book) =>
        set((state) => ({
          books: [book, ...state.books],
        })),

      updateBook: (id, updates) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updates } : book,
          ),
        })),

      removeBook: (id) => {
        // Cascade delete notes for this book.
        const { useNotesStore } =
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("@/store/notesStore") as typeof import("@/store/notesStore");
        const notesState = useNotesStore.getState();
        notesState.setNotes(
          notesState.notes.filter((note) => note.bookId !== id),
        );

        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      },

      setBooks: (books) => set({ books }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "books-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ books: state.books }),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
