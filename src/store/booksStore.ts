import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book } from "@/types/book";

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
      books: [],
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
            book.id === id
              ? { ...book, ...updates, updatedAt: new Date().toISOString() }
              : book
          ),
        })),

      removeBook: (id) => {
        // Cascade delete insights for this book.
        const { useInsightsStore } =
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("@/store/insightsStore") as typeof import("@/store/insightsStore");
        const insightsState = useInsightsStore.getState();
        insightsState.setInsights(
          insightsState.insights.filter((insight) => insight.bookId !== id)
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
        if (!state) return;

        const nowIso = new Date().toISOString();
        const migrated = state.books.map((book) => ({
          ...book,
          updatedAt:
            typeof (book as unknown as { updatedAt?: string }).updatedAt ===
            "string"
              ? (book as unknown as { updatedAt?: string }).updatedAt!
              : book.createdAt || nowIso,
        }));

        state.setBooks(migrated);
        state.setHasHydrated(true);
      },
    }
  )
);
