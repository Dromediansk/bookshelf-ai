import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { type BookGenre, type BookStatus } from "@/types/book";
import themeColors from "@/utils/colors";
import FormGenresSection from "./FormGenresSection";
import DateField from "./shared/DateField";

export type BookFormValues = {
  title: string;
  author: string;
  description: string;
  genre: BookGenre;
  status: BookStatus;
  createdAt?: string;
  finishedAt?: string;
};

type BookFormProps = {
  submitLabel?: string;
  initialValues?: Partial<BookFormValues>;
  onSubmit: (values: BookFormValues) => void;
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
}: BookFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [genre, setGenre] = useState<BookGenre>(
    initialValues?.genre ?? "Unknown"
  );
  const [createdAt, setCreatedAt] = useState<Date>(
    initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date()
  );
  const [finishedAt, setFinishedAt] = useState<Date>(
    initialValues?.finishedAt ? new Date(initialValues.finishedAt) : new Date()
  );
  const [status, setStatus] = useState<BookStatus>(
    initialValues?.status ?? "to-read"
  );

  const [isBookDetailsExpanded, setIsBookDetailsExpanded] = useState(true);
  const [isAdditionalDetailsExpanded, setIsAdditionalDetailsExpanded] =
    useState(false);

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setAuthor(initialValues?.author ?? "");
    setDescription(initialValues?.description ?? "");
    setGenre(initialValues?.genre ?? "Unknown");
    setCreatedAt(
      initialValues?.createdAt ? new Date(initialValues.createdAt) : new Date()
    );
    setFinishedAt(
      initialValues?.finishedAt
        ? new Date(initialValues.finishedAt)
        : new Date()
    );
    setStatus(initialValues?.status ?? "to-read");
  }, [
    initialValues?.title,
    initialValues?.author,
    initialValues?.description,
    initialValues?.genre,
    initialValues?.createdAt,
    initialValues?.finishedAt,
    initialValues?.status,
  ]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  const handleSubmit = () => {
    if (!canSave) return;

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre,
      status,
      createdAt: createdAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
    });
  };

  return (
    <View className="flex-1 px-4 py-4">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Book Details Section */}
        <View className="mb-3">
          <Pressable
            onPress={() => setIsBookDetailsExpanded(!isBookDetailsExpanded)}
            className="mb-2 flex-row items-center justify-between rounded-control border border-border bg-surface-muted px-card py-4"
            accessibilityRole="button"
            accessibilityLabel={`${isBookDetailsExpanded ? "Collapse" : "Expand"} Book Details`}
          >
            <Text className="text-base font-sansSemibold text-text">
              Book Details
            </Text>
            <Ionicons
              name={isBookDetailsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={themeColors.text.muted}
            />
          </Pressable>

          {isBookDetailsExpanded && (
            <View className="px-4">
              <View className="mb-5">
                <Text className="mb-2 text-sm font-sansMedium text-text">
                  Book name *
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
                  Author
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
                  Genre
                </Text>
                <FormGenresSection genre={genre} setGenre={setGenre} />
              </View>
            </View>
          )}
        </View>

        {/* Additional Details Section */}
        <View className="mb-3">
          <Pressable
            onPress={() =>
              setIsAdditionalDetailsExpanded(!isAdditionalDetailsExpanded)
            }
            className="mb-2 flex-row items-center justify-between rounded-control border border-border bg-surface-muted px-card py-4"
            accessibilityRole="button"
            accessibilityLabel={`${isAdditionalDetailsExpanded ? "Collapse" : "Expand"} Additional Details`}
          >
            <Text className="text-base font-sansSemibold text-text">
              Additional Details
            </Text>
            <Ionicons
              name={isAdditionalDetailsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={themeColors.text.muted}
            />
          </Pressable>

          {isAdditionalDetailsExpanded && (
            <View className="px-4">
              <View className="mb-5">
                <Text className="mb-2 text-sm font-sansMedium text-text">
                  Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="A brief description of the book"
                  className="h-32 rounded-control border border-border bg-surface px-card py-field text-base font-sans text-text"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View className="mb-6">
                <DateField
                  label="Creation Date"
                  date={createdAt}
                  setDate={setCreatedAt}
                />
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

              {status === "finished" && (
                <View className="mb-6">
                  <DateField
                    label="When did you finish the book?"
                    date={finishedAt}
                    setDate={setFinishedAt}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="pt-2 pb-8">
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
      </View>
    </View>
  );
};
