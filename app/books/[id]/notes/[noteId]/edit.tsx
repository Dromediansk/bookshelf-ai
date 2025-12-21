import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import NoteForm from "@/components/NoteForm";
import { useBooksStore } from "@/store/booksStore";
import { useNotesStore } from "@/store/notesStore";

type EditNoteParams = {
  id: string;
  noteId: string;
};

const EditNoteModal = () => {
  const params = useLocalSearchParams<EditNoteParams>();
  const bookId = params.id;
  const noteId = params.noteId;

  const { hasHydrated, getBookById } = useBooksStore();
  const { updateNote, notes } = useNotesStore();

  const book = bookId ? getBookById(bookId) : undefined;
  const note = noteId ? notes.find((value) => value.id === noteId) : undefined;
  const noteMatchesBook = !!note && !!bookId && note.bookId === bookId;

  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const didInitDraft = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!noteMatchesBook) return;
    if (didInitDraft.current) return;

    setDraftContent(note.content ?? "");
    setDraftTags(note.tags?.join(", ") ?? "");
    didInitDraft.current = true;
  }, [hasHydrated, noteMatchesBook, note]);

  const canSaveNote = useMemo(
    () => hasHydrated && draftContent.trim().length > 0,
    [draftContent, hasHydrated]
  );

  if (!bookId || !book) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-base font-sansMedium text-text">
            Book not found
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            The book you’re looking for no longer exists.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-control bg-brand px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text className="text-center text-base font-sansSemibold text-text-inverse">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!hasHydrated) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-base font-sansMedium text-text">
            Loading your library…
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            Please wait a moment and try again.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-control bg-brand px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text className="text-center text-base font-sansSemibold text-text-inverse">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!noteId || !noteMatchesBook) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-base font-sansMedium text-text">
            Note not found
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            The note you’re looking for no longer exists.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-6 rounded-control bg-brand px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text className="text-center text-base font-sansSemibold text-text-inverse">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function submitNote() {
    if (!canSaveNote) return;
    updateNote(bookId, noteId, { content: draftContent, tags: draftTags });
    router.back();
  }

  return (
    <View className="flex-1 bg-surface-muted">
      <Stack.Screen options={{ title: book.title }} />
      <View className="flex-1">
        <NoteForm
          noteMode="edit"
          draftContent={draftContent}
          setDraftContent={setDraftContent}
          draftTags={draftTags}
          setDraftTags={setDraftTags}
          canSaveNote={canSaveNote}
          submitNote={submitNote}
          resetDraft={() => router.back()}
        />
      </View>
    </View>
  );
};

export default EditNoteModal;
