import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { BookStatus } from "@/types/book";

export type BookFormValues = {
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
};

type BookFormProps = {
  screenTitle: string;
  screenSubtitle?: string;
  submitLabel?: string;
  initialValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => void;
  onCancel: () => void;
};

const STATUSES: Array<{ value: BookStatus; label: string }> = [
  { value: "to-read", label: "To Read" },
  { value: "reading", label: "Reading" },
  { value: "read", label: "Read" },
];

const GENRES: Array<{ value: string; label: string }> = [
  { value: "", label: "Not set" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Nonfiction", label: "Nonfiction" },
  { value: "Biography", label: "Biography" },
  { value: "History", label: "History" },
];

export function BookForm({
  screenTitle,
  screenSubtitle,
  submitLabel = "Save",
  initialValues,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [genre, setGenre] = useState(initialValues?.genre ?? "");
  const [status, setStatus] = useState<BookStatus>(
    initialValues?.status ?? "to-read"
  );

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setAuthor(initialValues?.author ?? "");
    setGenre(initialValues?.genre ?? "");
    setStatus(initialValues?.status ?? "to-read");
  }, [
    initialValues?.title,
    initialValues?.author,
    initialValues?.genre,
    initialValues?.status,
  ]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit() {
    if (!canSave) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      status,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <View className="px-screen pt-4">
        <Text className="text-2xl font-sansSemibold text-text">
          {screenTitle}
        </Text>
        {screenSubtitle ? (
          <Text className="mt-1 text-sm font-sans text-text-muted">
            {screenSubtitle}
          </Text>
        ) : null}
      </View>

      <View className="flex-1 justify-between px-screen pt-6 pb-4">
        <View>
          <View className="mb-5">
            <Text className="mb-2 text-sm font-sansMedium text-text">
              Book name
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Dune"
              className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-sansMedium text-text">
              Author (optional)
            </Text>
            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder="e.g. Frank Herbert"
              className="rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
              autoCapitalize="words"
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-sansMedium text-text">
              Genre (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {GENRES.map((g) => {
                const selected = g.value === genre;
                const key = g.value.length > 0 ? g.value : "__unset__";
                return (
                  <Pressable
                    key={key}
                    onPress={() => setGenre(g.value)}
                    className={
                      selected
                        ? "rounded-full bg-brand px-card py-2"
                        : "rounded-full border border-border bg-surface px-card py-2"
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Set genre to ${g.label}`}
                  >
                    <Text
                      className={
                        selected
                          ? "text-sm font-sansSemibold text-text-inverse"
                          : "text-sm font-sansSemibold text-text"
                      }
                    >
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-sansMedium text-text">
              Status
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {STATUSES.map((s) => {
                const selected = s.value === status;
                return (
                  <Pressable
                    key={s.value}
                    onPress={() => setStatus(s.value)}
                    className={
                      selected
                        ? "rounded-full bg-brand px-card py-2"
                        : "rounded-full border border-border bg-surface px-card py-2"
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Set status to ${s.label}`}
                  >
                    <Text
                      className={
                        selected
                          ? "text-sm font-sansSemibold text-text-inverse"
                          : "text-sm font-sansSemibold text-text"
                      }
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSave}
            className={
              canSave
                ? "rounded-control bg-brand px-card py-button"
                : "rounded-control bg-surface-muted px-card py-button"
            }
            accessibilityRole="button"
            accessibilityLabel={submitLabel}
          >
            <Text
              className={
                canSave
                  ? "text-center text-base font-sansSemibold text-text-inverse"
                  : "text-center text-base font-sansSemibold text-text-subtle"
              }
            >
              {submitLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            className="mt-3 rounded-control border border-border bg-surface px-card py-button"
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text className="text-center text-base font-sansSemibold text-text">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
