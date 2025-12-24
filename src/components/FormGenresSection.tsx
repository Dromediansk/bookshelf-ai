import { BookGenre } from "@/types/book";
import { BOOK_GENRES } from "@/utils/contants";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type FormGenresSectionProps = {
  genre: BookGenre;
  setGenre: (genre: BookGenre) => void;
};

const GENRES: { value: BookGenre; label: string }[] = BOOK_GENRES.map((g) => ({
  value: g,
  label: g === "Unknown" ? "Not set" : g,
}));

const FormGenresSection = ({ genre, setGenre }: FormGenresSectionProps) => {
  const [showAllGenres, setShowAllGenres] = useState(false);

  const visibleGenres = useMemo(() => {
    if (showAllGenres) return GENRES;

    const base = GENRES.slice(0, 8);
    if (!genre) return base;
    if (base.some((g) => g.value === genre)) return base;

    const selected = GENRES.find((g) => g.value === genre);
    if (!selected) return base;

    if (base.length < 8) return [...base, selected];

    const next = [...base];
    next[7] = selected;
    return next;
  }, [genre, showAllGenres]);

  return (
    <>
      <View className="flex-row flex-wrap gap-2">
        {visibleGenres.map((g) => {
          const selected = g.value === genre;
          return (
            <Pressable
              key={g.value}
              onPress={() => setGenre(g.value)}
              className={
                selected
                  ? "rounded-full bg-brand px-card py-2"
                  : "rounded-full border border-border bg-surface px-card py-2"
              }
              accessibilityRole="button"
              accessibilityLabel={`Set genre to ${g.label}`}
              accessibilityState={{ selected }}
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
      {GENRES.length > 8 ? (
        <Pressable
          onPress={() => setShowAllGenres((prev) => !prev)}
          className="mt-2 self-start"
          accessibilityRole="button"
          accessibilityLabel={
            showAllGenres ? "Show fewer genres" : "Show all genres"
          }
          accessibilityState={{ expanded: showAllGenres }}
        >
          <Text className="text-sm font-sansSemibold text-brand">
            {showAllGenres ? "Show fewer genres" : "Show all genres"}
          </Text>
        </Pressable>
      ) : null}
    </>
  );
};

export default FormGenresSection;
