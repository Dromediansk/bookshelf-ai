import { InsightMode } from "@/types/insight";
import { FC } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type InsightFormProps = {
  insightMode: InsightMode;
  draftContent: string;
  setDraftContent: (value: string) => void;
  draftTags: string;
  setDraftTags: (value: string) => void;
  canSaveInsight: boolean;
  submitInsight: () => void;
  resetDraft: () => void;
};

const InsightForm: FC<InsightFormProps> = ({
  insightMode,
  draftContent,
  setDraftContent,
  draftTags,
  setDraftTags,
  canSaveInsight,
  submitInsight,
  resetDraft,
}) => {
  return (
    <View className="border border-border bg-surface-muted px-card py-card">
      <Text className="text-sm font-sansSemibold text-brand">
        {insightMode === "add" ? "New insight" : "Edit insight"}
      </Text>

      <View className="mt-4">
        <TextInput
          value={draftContent}
          onChangeText={setDraftContent}
          placeholder="Write an idea you want to remember…"
          className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text h-32"
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm font-sansMedium text-text">Tags</Text>
        <TextInput
          value={draftTags}
          onChangeText={setDraftTags}
          placeholder="e.g. inspiring, focus, habits"
          className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
          autoCapitalize="none"
        />
        <Text className="mt-2 text-xs font-sans text-text-subtle">
          Separate tags with commas.
        </Text>
      </View>

      <View className="mt-5">
        <Pressable
          onPress={submitInsight}
          disabled={!canSaveInsight}
          className={
            canSaveInsight
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
              canSaveInsight
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
  );
};

export default InsightForm;
