import { useBooksStore } from "@/store/booksStore";
import { useNotesStore } from "@/store/notesStore";
import { Note } from "@/types/note";
import { toTime } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, Text, View } from "react-native";

type BookNoteProps = {
  bookId: string;
  note: Note;
  onStartEdit: (note: Note) => void;
  onResetDraft: () => void;
  noteMode: "none" | "add" | "edit";
  editingNoteId?: string;
};

function formatNoteDate(value: string | undefined) {
  const time = toTime(value);
  if (!time) return undefined;

  return new Date(time).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BookNote: FC<BookNoteProps> = ({
  bookId,
  note,
  onStartEdit,
  onResetDraft,
  noteMode,
  editingNoteId,
}) => {
  const { hasHydrated } = useBooksStore();
  const { deleteNote } = useNotesStore();

  const dateLabel = formatNoteDate(note.createdAt);

  return (
    <Pressable
      key={note.id}
      onPress={() => onStartEdit(note)}
      disabled={!hasHydrated}
      className="rounded-card border border-border bg-surface-muted px-card py-card"
      accessibilityRole="button"
      accessibilityLabel="Edit note"
    >
      <View className={hasHydrated ? undefined : "opacity-60"}>
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-sm font-sans text-text">
            {note.content}
          </Text>
          {dateLabel ? (
            <Text className="text-xs font-sans text-text-subtle">
              {dateLabel}
            </Text>
          ) : null}
        </View>

        <View className="mt-3 flex-row items-start justify-between gap-3">
          <View className="flex-1 flex-row flex-wrap gap-2">
            {note.tags?.map((tag) => (
              <View
                key={`${note.id}:${tag}`}
                className="rounded-full border border-border bg-surface px-2 py-1"
              >
                <Text className="text-xs font-sansMedium text-text">{tag}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={(event) => {
              event.stopPropagation?.();
              if (!hasHydrated) return;
              if (noteMode === "edit" && editingNoteId === note.id) {
                onResetDraft();
              }
              deleteNote(bookId, note.id);
            }}
            disabled={!hasHydrated}
            className={
              hasHydrated
                ? "rounded-control border border-border bg-surface p-2"
                : "rounded-control border border-border bg-surface-muted p-2"
            }
            accessibilityRole="button"
            accessibilityLabel="Delete note"
          >
            <Ionicons name="trash-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default BookNote;
