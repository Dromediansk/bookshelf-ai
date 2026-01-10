import { InsightMode } from "@/types/insight";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { Text, TextInput, View } from "react-native";
import themeColors from "@/utils/colors";
import {
  MAX_INSIGHT_CONTENT_CHARS,
  MAX_INSIGHT_TAGS_CHARS,
} from "@/utils/contants";
import CharacterCountHint from "@/components/shared/CharacterCountHint";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export type InsightFormHandle = {
  submit: () => void;
};

type InsightFormProps = {
  insightMode: InsightMode;
  isReady?: boolean;
  draftContent: string;
  setDraftContent: (value: string) => void;
  draftTags: string;
  setDraftTags: (value: string) => void;
  submitInsight: () => void;
  bookPicker?: ReactNode | null;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

const InsightForm = forwardRef<InsightFormHandle, InsightFormProps>(
  (
    {
      insightMode,
      isReady = true,
      draftContent,
      setDraftContent,
      draftTags,
      setDraftTags,
      submitInsight,
      bookPicker,
      onCanSubmitChange,
    },
    ref
  ) => {
    const canSubmit =
      isReady &&
      draftContent.trim().length > 0 &&
      draftContent.length <= MAX_INSIGHT_CONTENT_CHARS &&
      draftTags.length <= MAX_INSIGHT_TAGS_CHARS;

    useEffect(() => {
      onCanSubmitChange?.(canSubmit);
    }, [canSubmit, onCanSubmitChange]);

    const handleSubmit = useCallback(() => {
      if (!canSubmit) return;
      submitInsight();
    }, [canSubmit, submitInsight]);

    useImperativeHandle(
      ref,
      () => ({
        submit: handleSubmit,
      }),
      [handleSubmit]
    );

    return (
      <KeyboardAwareScrollView
        bottomOffset={62}
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
        </View>
      </KeyboardAwareScrollView>
    );
  }
);

InsightForm.displayName = "InsightForm";

export default InsightForm;
