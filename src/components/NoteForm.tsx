import { NoteMode } from "@/types/note";
import { FC } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type NoteFormProps = {
  noteMode: NoteMode;
  draftContent: string;
  setDraftContent: (value: string) => void;
  draftTags: string;
  setDraftTags: (value: string) => void;
  canSaveNote: boolean;
  submitNote: () => void;
  resetDraft: () => void;
};

const NoteForm: FC<NoteFormProps> = ({
  noteMode,
  draftContent,
  setDraftContent,
  draftTags,
  setDraftTags,
  canSaveNote,
  submitNote,
  resetDraft,
}) => {
  return (
    <View className="mt-4 rounded-card border border-border bg-surface-muted px-card py-card">
      <Text className="text-sm font-sansSemibold text-text">
        {noteMode === "add" ? "New note" : "Edit note"}
      </Text>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-sansMedium text-text">Note</Text>
        <TextInput
          value={draftContent}
          onChangeText={setDraftContent}
          placeholder="Write your note…"
          className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-sansMedium text-text">
          Tags (optional)
        </Text>
        <TextInput
          value={draftTags}
          onChangeText={setDraftTags}
          placeholder="e.g. characters, quotes"
          className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
          autoCapitalize="none"
        />
        <Text className="mt-2 text-xs font-sans text-text-subtle">
          Separate tags with commas.
        </Text>
      </View>

      <View className="mt-5">
        <Pressable
          onPress={submitNote}
          disabled={!canSaveNote}
          className={
            canSaveNote
              ? "rounded-control bg-brand px-card py-button"
              : "rounded-control bg-surface px-card py-button"
          }
          accessibilityRole="button"
          accessibilityLabel={
            noteMode === "add" ? "Add note" : "Save note changes"
          }
        >
          <Text
            className={
              canSaveNote
                ? "text-center text-base font-sansSemibold text-text-inverse"
                : "text-center text-base font-sansSemibold text-text-subtle"
            }
          >
            {noteMode === "add" ? "Add note" : "Save"}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetDraft}
          className="mt-3 rounded-control border border-border bg-surface px-card py-button"
          accessibilityRole="button"
          accessibilityLabel="Cancel note"
        >
          <Text className="text-center text-base font-sansSemibold text-text">
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NoteForm;
