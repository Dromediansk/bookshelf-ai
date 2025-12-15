import { useBooksStore } from "@/store/booksStore";
import { useNotesStore } from "@/store/notesStore";
import { Book } from "@/types/book";
import { toTime } from "@/utils/helpers";
import { FC, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import BookNote from "./BookNote";
import { Note, NoteMode } from "@/types/note";
import NoteForm from "./NoteForm";

type NotesSectionProps = {
  book: Book;
};

export const NotesSection: FC<NotesSectionProps> = ({ book }) => {
  const { id, noteIds } = book;
  const { height: windowHeight } = useWindowDimensions();
  const { hasHydrated } = useBooksStore();
  const { addNote, updateNote, getNotesByIds } = useNotesStore();

  const [noteMode, setNoteMode] = useState<NoteMode>("none");
  const [editingNoteId, setEditingNoteId] = useState<string | undefined>();
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");

  function resetDraft() {
    setNoteMode("none");
    setEditingNoteId(undefined);
    setDraftContent("");
    setDraftTags("");
  }

  const notes = useMemo(() => {
    if (!noteIds.length) return [];
    return getNotesByIds(noteIds);
  }, [getNotesByIds, noteIds]);

  const sortedNotes = [...notes].sort(
    (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
  );

  const notesCountLabel =
    sortedNotes.length === 1 ? "1 note" : `${sortedNotes.length} notes`;

  const canSaveNote = useMemo(
    () => hasHydrated && draftContent.trim().length > 0,
    [draftContent, hasHydrated],
  );

  const notesListMaxHeight = useMemo(() => {
    const computed = Math.round(windowHeight * 0.45);
    return Math.max(220, Math.min(computed, 420));
  }, [windowHeight]);

  function startAddNote() {
    if (!hasHydrated) return;
    setNoteMode("add");
    setEditingNoteId(undefined);
    setDraftContent("");
    setDraftTags("");
  }

  function startEditNote(note: Note) {
    if (!hasHydrated) return;
    setNoteMode("edit");
    setEditingNoteId(note.id);
    setDraftContent(note.content ?? "");
    setDraftTags(note.tags?.join(", ") ?? "");
  }

  function submitNote() {
    if (!hasHydrated) return;
    if (!canSaveNote) return;

    if (noteMode === "add") {
      addNote(id, { content: draftContent, tags: draftTags });
      resetDraft();
      return;
    }

    if (noteMode === "edit" && editingNoteId) {
      updateNote(id, editingNoteId, {
        content: draftContent,
        tags: draftTags,
      });
      resetDraft();
    }
  }

  return (
    <View className="mt-6 rounded-card border border-border bg-surface px-card py-card">
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

      {noteMode !== "none" ? (
        <NoteForm
          noteMode={noteMode}
          draftContent={draftContent}
          setDraftContent={setDraftContent}
          draftTags={draftTags}
          setDraftTags={setDraftTags}
          canSaveNote={canSaveNote}
          submitNote={submitNote}
          resetDraft={resetDraft}
        />
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
          className="mt-4"
          style={{ maxHeight: notesListMaxHeight }}
          contentContainerClassName="gap-3"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          {sortedNotes.map((note) => {
            return (
              <BookNote
                key={note.id}
                bookId={id}
                note={note}
                onStartEdit={startEditNote}
                onResetDraft={resetDraft}
                noteMode={noteMode}
                editingNoteId={editingNoteId}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
