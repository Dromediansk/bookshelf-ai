import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import InsightForm from "@/components/InsightForm";
import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";

type EditInsightParams = {
  id: string;
  insightId: string;
};

const EditInsightModal = () => {
  const params = useLocalSearchParams<EditInsightParams>();
  const bookId = params.id;
  const insightId = params.insightId;

  const { hasHydrated, getBookById } = useBooksStore();
  const { updateInsight, insights } = useInsightsStore();

  const book = bookId ? getBookById(bookId) : undefined;
  const insight = insightId
    ? insights.find((value) => value.id === insightId)
    : undefined;
  const insightMatchesBook = !!insight && !!bookId && insight.bookId === bookId;

  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const didInitDraft = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!insightMatchesBook) return;
    if (didInitDraft.current) return;

    setDraftContent(insight.content ?? "");
    setDraftTags(insight.tags?.join(", ") ?? "");
    didInitDraft.current = true;
  }, [hasHydrated, insightMatchesBook, insight]);

  const isFormReady = useMemo(
    () => hasHydrated && insightMatchesBook,
    [hasHydrated, insightMatchesBook]
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

  if (!insightId || !insightMatchesBook) {
    return (
      <View className="flex-1 bg-surface py-2">
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-base font-sansMedium text-text">
            Insight not found
          </Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            The insight you’re looking for no longer exists.
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
    if (!isFormReady) return;
    updateInsight(bookId, insightId, {
      content: draftContent,
      tags: draftTags,
    });
    router.back();
  }

  return (
    <View className="flex-1 bg-surface-muted px-2 pt-2">
      <Stack.Screen options={{ title: book.title }} />
      <InsightForm
        insightMode="edit"
        isReady={isFormReady}
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

export default EditInsightModal;
