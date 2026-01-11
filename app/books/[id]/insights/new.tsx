import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import InsightForm, { type InsightFormHandle } from "@/components/InsightForm";
import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import themeColors from "@/utils/colors";

type NewInsightParams = {
  id: string;
};

const NewInsightModal = () => {
  const params = useLocalSearchParams<NewInsightParams>();
  const bookId = params.id;

  const { hasHydrated, getBookById } = useBooksStore();
  const { addInsight } = useInsightsStore();

  const book = bookId ? getBookById(bookId) : undefined;

  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");

  const formRef = useRef<InsightFormHandle>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const submitInsight = () => {
    if (!hasHydrated) return;
    addInsight(bookId, { content: draftContent, tags: draftTags });
    router.back();
  };

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

  return (
    <>
      <Stack.Screen
        options={{
          title: book.title,
          headerRight: ({ tintColor }) => (
            <Pressable
              onPress={() => formRef.current?.submit()}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Save insight"
              hitSlop={10}
              style={{ opacity: canSubmit ? 1 : 0.4 }}
            >
              <Ionicons
                name="checkmark"
                size={24}
                color={
                  canSubmit
                    ? (tintColor ?? themeColors.text.DEFAULT)
                    : themeColors.text.muted
                }
              />
            </Pressable>
          ),
        }}
      />
      <InsightForm
        ref={formRef}
        insightMode="add"
        isReady={hasHydrated}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        draftTags={draftTags}
        setDraftTags={setDraftTags}
        submitInsight={submitInsight}
        onCanSubmitChange={setCanSubmit}
      />
    </>
  );
};

export default NewInsightModal;
