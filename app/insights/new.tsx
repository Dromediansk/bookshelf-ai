import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import InsightForm from "@/components/InsightForm";
import { useBooksStore } from "@/store/booksStore";
import { useInsightsStore } from "@/store/insightsStore";
import themeColors from "@/utils/colors";
import { sortBooksForList } from "@/utils/helpers";

const IOS_PICKER_HEIGHT = 140;
const IOS_PICKER_Y_OFFSET = 24;

const NewInsightModal = () => {
  const { books, hasHydrated } = useBooksStore();
  const { addInsight } = useInsightsStore();

  const sortedBooks = useMemo(() => sortBooksForList(books), [books]);
  const defaultBookId = useMemo(() => {
    const firstReading = sortedBooks.find((b) => b.status === "reading");
    return firstReading?.id ?? sortedBooks[0]?.id;
  }, [sortedBooks]);

  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!hasHydrated || selectedBookId || !defaultBookId) return;
    setSelectedBookId(defaultBookId);
  }, [hasHydrated, selectedBookId, defaultBookId]);

  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState("");

  const effectiveSelectedBookId = selectedBookId ?? defaultBookId;

  const isFormReady = useMemo(() => {
    return (
      hasHydrated &&
      !!effectiveSelectedBookId &&
      sortedBooks.some((b) => b.id === effectiveSelectedBookId)
    );
  }, [effectiveSelectedBookId, hasHydrated, sortedBooks]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 bg-surface py-2">
        <Stack.Screen options={{ title: "New Insight" }} />
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

  if (sortedBooks.length === 0) {
    return (
      <View className="flex-1 bg-surface py-2">
        <Stack.Screen options={{ title: "New Insight" }} />
        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-base font-sansMedium text-text">No books</Text>
          <Text className="mt-2 text-sm font-sans text-text-muted">
            Add a book first to attach an insight.
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

  const submitInsight = () => {
    if (!isFormReady || !effectiveSelectedBookId) return;

    addInsight(effectiveSelectedBookId, {
      content: draftContent,
      tags: draftTags,
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-surface-muted">
      <Stack.Screen options={{ title: "New Insight" }} />

      <View className="px-2 pt-2">
        <View className="rounded-control border border-border bg-surface px-card py-card">
          <Text className="text-sm font-sansSemibold text-brand">Book</Text>
          <View
            className="mt-3 overflow-hidden rounded-control border border-border bg-surface"
            style={
              Platform.OS === "ios" ? { height: IOS_PICKER_HEIGHT } : undefined
            }
          >
            <Picker
              selectedValue={effectiveSelectedBookId}
              onValueChange={(value) =>
                setSelectedBookId(typeof value === "string" ? value : undefined)
              }
              dropdownIconColor={
                Platform.OS === "android" ? themeColors.text.DEFAULT : undefined
              }
              style={
                Platform.OS === "ios"
                  ? {
                      height: IOS_PICKER_HEIGHT + IOS_PICKER_Y_OFFSET * 2,
                      transform: [{ translateY: -IOS_PICKER_Y_OFFSET }],
                    }
                  : {
                      color: themeColors.text.DEFAULT,
                    }
              }
            >
              {sortedBooks.map((book) => (
                <Picker.Item key={book.id} label={book.title} value={book.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View className="flex-1">
        <InsightForm
          insightMode="add"
          isReady={isFormReady}
          draftContent={draftContent}
          setDraftContent={setDraftContent}
          draftTags={draftTags}
          setDraftTags={setDraftTags}
          submitInsight={submitInsight}
          resetDraft={() => router.back()}
        />
      </View>
    </View>
  );
};

export default NewInsightModal;
