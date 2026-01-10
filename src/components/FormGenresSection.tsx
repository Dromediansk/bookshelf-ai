import { BookGenre } from "@/types/book";
import { BOOK_GENRES } from "@/utils/contants";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type FormGenresSectionProps = {
  genre: BookGenre;
  setGenre: (genre: BookGenre) => void;
};

type GenrePillProps = {
  genre: BookGenre;
  selected: boolean;
  onPress: () => void;
};

const GenrePill = ({ genre, selected, onPress }: GenrePillProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={
        selected
          ? "rounded-full bg-brand px-card py-2"
          : "rounded-full border border-border bg-surface px-card py-2"
      }
      accessibilityRole="button"
      accessibilityLabel={`Set genre to ${genre}`}
      accessibilityState={{ selected }}
    >
      <Text
        className={
          selected
            ? "text-sm font-sansSemibold text-text-inverse"
            : "text-sm font-sansSemibold text-text"
        }
      >
        {genre}
      </Text>
    </Pressable>
  );
};

const FormGenresSection = ({ genre, setGenre }: FormGenresSectionProps) => {
  const [showAllGenres, setShowAllGenres] = useState(false);

  const { baseGenres, otherGenres } = useMemo(() => {
    const allGenres = BOOK_GENRES;
    const baseRaw = allGenres.slice(0, 8);
    const baseSet = new Set(baseRaw);

    const baseGenres = Array.from(new Set(baseRaw)).sort((a, b) =>
      a.localeCompare(b)
    );
    const unknownIndex = baseGenres.indexOf("Unknown");
    if (unknownIndex !== -1) {
      baseGenres.splice(unknownIndex, 1);
      baseGenres.unshift("Unknown");
    }

    const otherGenres = Array.from(
      new Set(allGenres.filter((g) => !baseSet.has(g)))
    ).sort((a, b) => a.localeCompare(b));

    return { baseGenres, otherGenres };
  }, []);

  return (
    <>
      <View className="flex-row flex-wrap gap-2">
        {baseGenres.map((g) => (
          <GenrePill
            key={g}
            genre={g}
            selected={g === genre}
            onPress={() => setGenre(g)}
          />
        ))}
      </View>

      {showAllGenres && otherGenres.length > 0 ? (
        <View className="mt-4">
          <View className="mb-2 border-t border-border pt-3">
            <Text className="text-sm font-sansSemibold text-text-muted">
              More Genres
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {otherGenres.map((g) => (
              <GenrePill
                key={g}
                genre={g}
                selected={g === genre}
                onPress={() => setGenre(g)}
              />
            ))}
          </View>
        </View>
      ) : null}
      {BOOK_GENRES.length > 8 ? (
        <Pressable
          onPress={() => setShowAllGenres((prev) => !prev)}
          className="mt-2 self-start"
          accessibilityRole="button"
          accessibilityLabel={
            showAllGenres ? "Show fewer genres" : "Show more genres"
          }
          accessibilityState={{ expanded: showAllGenres }}
        >
          <Text className="text-sm font-sansSemibold text-brand">
            {showAllGenres ? "Show fewer genres" : "Show more genres"}
          </Text>
        </Pressable>
      ) : null}
    </>
  );
};

export default FormGenresSection;
