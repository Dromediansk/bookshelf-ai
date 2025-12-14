import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book } from "@/types/book";
import type { Note } from "@/types/note";
import { MOCK_BOOKS } from "mocks/books";

type NoteInput = {
  content: string;
  tags?: string[] | string;
};

type NoteUpdates = {
  content?: string;
  tags?: string[] | string;
};

function createNoteId() {
  return `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeTags(tags: string[] | string | undefined): string[] {
  const values = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",")
    : [];

  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

type BooksState = {
  books: Book[];
  hasHydrated: boolean;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Omit<Book, "id">>) => void;
  removeBook: (id: string) => void;
  addNote: (bookId: string, note: NoteInput) => void;
  updateNote: (bookId: string, noteId: string, updates: NoteUpdates) => void;
  removeNote: (bookId: string, noteId: string) => void;
  setBooks: (books: Book[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

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

      addNote: (bookId, note) =>
        set((state) => {
          const content = note.content.trim();
          if (!content) return state;

          const newNote: Note = {
            id: createNoteId(),
            bookId,
            content,
            tags: normalizeTags(note.tags),
            createdAt: new Date().toISOString(),
          };

          return {
            books: state.books.map((book) =>
              book.id === bookId
                ? { ...book, notes: [newNote, ...book.notes] }
                : book
            ),
          };
        }),

      updateNote: (bookId, noteId, updates) =>
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;

            const nextContent =
              typeof updates.content === "string"
                ? updates.content.trim()
                : undefined;

            return {
              ...book,
              notes: book.notes.map((note) => {
                if (note.id !== noteId) return note;

                return {
                  ...note,
                  content:
                    nextContent && nextContent.length > 0
                      ? nextContent
                      : note.content,
                  tags:
                    updates.tags === undefined
                      ? note.tags
                      : normalizeTags(updates.tags),
                };
              }),
            };
          }),
        })),

      removeNote: (bookId, noteId) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, notes: book.notes.filter((n) => n.id !== noteId) }
              : book
          ),
        })),

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
    }
  )
);
