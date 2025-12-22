import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useBooksStore } from "@/store/booksStore";
import type { Note } from "@/types/note";
import { MOCK_NOTES } from "mocks/notes";
import { randomUUID } from "expo-crypto";

type NoteInput = {
  content: string;
  tags?: string[] | string;
};

type NoteUpdates = {
  content?: string;
  tags?: string[] | string;
};

type NotesState = {
  notes: Note[];
  hasHydrated: boolean;
  addNote: (bookId: string, note: NoteInput) => void;
  updateNote: (bookId: string, noteId: string, updates: NoteUpdates) => void;
  deleteNote: (bookId: string, noteId: string) => void;
  setNotes: (notes: Note[]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  getNotesByBookId: (bookId: string) => Note[];
  getNotesByIds: (ids: string[]) => Note[];
};

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

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: MOCK_NOTES,
      hasHydrated: false,

      setNotes: (notes) => set({ notes }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      getNotesByBookId: (bookId) =>
        get().notes.filter((note) => note.bookId === bookId),

      getNotesByIds: (ids) => {
        if (!ids.length) return [];
        const idSet = new Set(ids);
        return get().notes.filter((note) => idSet.has(note.id));
      },

      addNote: (bookId, note) => {
        const content = note.content.trim();
        if (!content) return;

        const nowIso = new Date().toISOString();

        const newNote: Note = {
          id: randomUUID(),
          bookId,
          content,
          tags: normalizeTags(note.tags),
          createdAt: nowIso,
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
        }));

        // Attach the note id to the book.
        useBooksStore.setState((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const existing = Array.isArray(book.noteIds) ? book.noteIds : [];
            if (existing.includes(newNote.id)) return book;
            return {
              ...book,
              noteIds: [...existing, newNote.id],
              updatedAt: nowIso,
            };
          }),
        }));
      },

      updateNote: (bookId, noteId, updates) => {
        const nextContent =
          typeof updates.content === "string"
            ? updates.content.trim()
            : undefined;

        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id !== noteId) return note;
            if (note.bookId !== bookId) return note;

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
        }));
      },

      deleteNote: (bookId, noteId) => {
        const nowIso = new Date().toISOString();

        // 1) Remove the note content from the global notes list.
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));

        // 2) Detach the reference from the book.
        useBooksStore.setState((state) => ({
          books: state.books.map((book) => {
            if (book.id !== bookId) return book;
            const existing = Array.isArray(book.noteIds) ? book.noteIds : [];
            if (!existing.includes(noteId)) return book;
            return {
              ...book,
              noteIds: existing.filter((id) => id !== noteId),
              updatedAt: nowIso,
            };
          }),
        }));
      },
    }),
    {
      name: "notes-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ notes: state.notes }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
