import { InsightMode } from "@/types/insight";
import { FC, ReactNode } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import themeColors from "@/utils/colors";
import {
  MAX_INSIGHT_CONTENT_CHARS,
  MAX_INSIGHT_TAGS_CHARS,
} from "@/utils/contants";
import CharacterCountHint from "@/components/shared/CharacterCountHint";

type InsightFormProps = {
  insightMode: InsightMode;
  isReady?: boolean;
  draftContent: string;
  setDraftContent: (value: string) => void;
  draftTags: string;
  setDraftTags: (value: string) => void;
  submitInsight: () => void;
  resetDraft: () => void;
  bookPicker?: ReactNode | null;
};

const InsightForm: FC<InsightFormProps> = ({
  insightMode,
  isReady = true,
  draftContent,
  setDraftContent,
  draftTags,
  setDraftTags,
  submitInsight,
  resetDraft,
  bookPicker,
}) => {
  const canSubmit =
    isReady &&
    draftContent.trim().length > 0 &&
    draftContent.length <= MAX_INSIGHT_CONTENT_CHARS &&
    draftTags.length <= MAX_INSIGHT_TAGS_CHARS;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1 border border-border bg-surface-muted px-card py-card"
    >
      {bookPicker}

      <View>
        <Text className="text-sm font-sansSemibold text-brand">
          {insightMode === "add" ? "New insight" : "Edit insight"}
        </Text>

        <View className="mt-4">
          <TextInput
            value={draftContent}
            onChangeText={setDraftContent}
            placeholder="Write an idea you want to remember…"
            placeholderTextColor={themeColors.text.placeholder}
            className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text h-48"
            multiline
            textAlignVertical="top"
            autoFocus
            maxLength={MAX_INSIGHT_CONTENT_CHARS}
          />
          <CharacterCountHint
            current={draftContent.length}
            max={MAX_INSIGHT_CONTENT_CHARS}
          />
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-sm font-sansMedium text-text">Tags</Text>
          <TextInput
            value={draftTags}
            onChangeText={setDraftTags}
            placeholder="e.g. inspiring, focus, habits"
            placeholderTextColor={themeColors.text.placeholder}
            className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
            autoCapitalize="none"
            maxLength={MAX_INSIGHT_TAGS_CHARS}
          />
          <CharacterCountHint
            current={draftTags.length}
            max={MAX_INSIGHT_TAGS_CHARS}
          />
          <Text className="mt-2 text-xs font-sans text-text-subtle">
            Separate tags with commas.
          </Text>
        </View>

        <View className="mt-5">
          <Pressable
            onPress={() => {
              if (!canSubmit) return;
              submitInsight();
            }}
            disabled={!canSubmit}
            className={
              canSubmit
                ? "rounded-control bg-brand px-card py-button"
                : "rounded-control bg-surface px-card py-button"
            }
            accessibilityRole="button"
            accessibilityLabel={
              insightMode === "add" ? "Add insight" : "Save insight changes"
            }
          >
            <Text
              className={
                canSubmit
                  ? "text-center text-base font-sansSemibold text-text-inverse"
                  : "text-center text-base font-sansSemibold text-text-subtle"
              }
            >
              {insightMode === "add" ? "Add insight" : "Save"}
            </Text>
          </Pressable>

          <Pressable
            onPress={resetDraft}
            className="mt-3 rounded-control border border-border bg-surface px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Cancel insight"
          >
            <Text className="text-center text-base font-sansSemibold text-text">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default InsightForm;
