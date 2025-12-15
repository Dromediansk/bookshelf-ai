import { useBooksStore } from "@/store/booksStore";
import { useNotesStore } from "@/store/notesStore";
import { Book } from "@/types/book";
import { toTime } from "@/utils/helpers";
import { router } from "expo-router";
import { FC } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import BookNote from "./BookNote";

type NotesSectionProps = {
  book: Book;
};

export const NotesSection: FC<NotesSectionProps> = ({ book }) => {
  const { id, noteIds } = book;
  const { hasHydrated } = useBooksStore();
  const { getNotesByIds } = useNotesStore();

  const notes = noteIds.length ? getNotesByIds(noteIds) : [];

  const sortedNotes = [...notes].sort(
    (a, b) => toTime(b.createdAt) - toTime(a.createdAt)
  );

  const notesCountLabel =
    sortedNotes.length === 1 ? "1 note" : `${sortedNotes.length} notes`;

  function startAddNote() {
    if (!hasHydrated) return;
    router.push({ pathname: "/books/[id]/notes/new", params: { id } });
  }

  return (
    <View className="mt-6 flex-1 rounded-card border border-border bg-surface px-card py-card">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-sm font-sansMedium text-brand">Notes</Text>

        <View className="flex-row items-center gap-3">
          <Text className="text-xs font-sans text-text-subtle">
            {notesCountLabel}
          </Text>

          <Pressable
            onPress={startAddNote}
            disabled={!hasHydrated}
            className={
              hasHydrated
                ? "rounded-full bg-brand px-card py-2"
                : "rounded-full bg-surface-muted px-card py-2"
            }
            accessibilityRole="button"
            accessibilityLabel="Add note"
          >
            <Text
              className={
                hasHydrated
                  ? "text-xs font-sansSemibold text-text-inverse"
                  : "text-xs font-sansSemibold text-text-subtle"
              }
            >
              Add note
            </Text>
          </Pressable>
        </View>
      </View>

      {!hasHydrated ? (
        <Text className="mt-2 text-xs font-sans text-text-subtle">
          Loading your library…
        </Text>
      ) : null}

      {sortedNotes.length === 0 ? (
        <View className="mt-4 rounded-card border border-border bg-surface-muted px-card py-card">
          <Text className="text-sm font-sansSemibold text-text">
            No notes yet
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            Your personal insights and ideas for this book will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="mt-4 flex-1"
          contentContainerClassName="gap-3"
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {sortedNotes.map((note) => {
            return <BookNote key={note.id} bookId={id} note={note} />;
          })}
        </ScrollView>
      )}
    </View>
  );
};
