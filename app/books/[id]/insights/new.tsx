import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import InsightForm from "@/components/InsightForm";
import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";

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

  function submitInsight() {
    if (!hasHydrated) return;
    addInsight(bookId, { content: draftContent, tags: draftTags });
    router.back();
  }

  return (
    <View className="flex-1 bg-surface-muted px-2 pt-2">
      <Stack.Screen options={{ title: book.title }} />
      <InsightForm
        insightMode="add"
        isReady={hasHydrated}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        draftTags={draftTags}
        setDraftTags={setDraftTags}
        submitInsight={submitInsight}
        resetDraft={() => router.back()}
      />
    </View>
  );
};

export default NewInsightModal;
