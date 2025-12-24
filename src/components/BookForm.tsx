import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { type BookGenre, type BookStatus } from "@/types/book";
import FormGenresSection from "./FormGenresSection";

export type BookFormValues = {
  title: string;
  author: string;
  description: string;
  genre: BookGenre;
  status: BookStatus;
};

type BookFormProps = {
  submitLabel?: string;
  initialValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => void;
  onCancel: () => void;
};

const STATUSES: { value: BookStatus; label: string }[] = [
  { value: "to-read", label: "To Read" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
];

export const BookForm = ({
  submitLabel = "Save",
  initialValues,
  onSubmit,
  onCancel,
}: BookFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [genre, setGenre] = useState<BookGenre>(
    initialValues?.genre ?? "Unknown"
  );
  const [status, setStatus] = useState<BookStatus>(
    initialValues?.status ?? "to-read"
  );

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setAuthor(initialValues?.author ?? "");
    setDescription(initialValues?.description ?? "");
    setGenre(initialValues?.genre ?? "Unknown");
    setStatus(initialValues?.status ?? "to-read");
  }, [
    initialValues?.title,
    initialValues?.author,
    initialValues?.description,
    initialValues?.genre,
    initialValues?.status,
  ]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  function handleSubmit() {
    if (!canSave) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre,
      status,
    });
  }

  return (
    <View className="flex-1 px-4 py-4">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
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

        <View className="mb-5">
          <Text className="mb-2 text-sm font-sansMedium text-text">
            Description (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description..."
            className="h-32 rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-sansMedium text-text">
            Genre (optional)
          </Text>
          <FormGenresSection genre={genre} setGenre={setGenre} />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-sansMedium text-text">Status</Text>
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
      </ScrollView>

      <View className="pt-2">
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
  );
};
