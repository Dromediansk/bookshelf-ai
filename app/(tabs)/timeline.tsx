import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

import { useBooksStore } from "@/store/booksStore";
import { useNotesStore } from "@/store/notesStore";
import type { Book } from "@/types/book";
import type { Note } from "@/types/note";
import {
  formatRelativeTime,
  isWithinLastNDays,
  sortByDateDesc,
} from "@/utils/helpers";

type TimelineEvent = {
  id: string;
  type: "note" | "finished-book";
  createdAt: string;
  bookTitle: string;
};

const LAST_N_DAYS = 7;

const buildTimelineEvents = (books: Book[], notes: Note[]): TimelineEvent[] => {
  const bookById = new Map(books.map((book) => [book.id, book] as const));

  const noteEvents: TimelineEvent[] = notes.map((note) => {
    const book = bookById.get(note.bookId);
    return {
      id: `note:${note.id}`,
      type: "note",
      createdAt: note.createdAt,
      bookTitle: book ? book.title : "Unknown book",
    };
  });

  const finishedBookEvents: TimelineEvent[] = books
    .filter((book) => book.status === "read")
    .map((book) => ({
      id: `book:${book.id}`,
      type: "finished-book",
      createdAt: book.updatedAt,
      bookTitle: book.title,
    }));

  return sortByDateDesc(
    [...noteEvents, ...finishedBookEvents],
    (e) => e.createdAt
  );
};

export const TimelineScreen = () => {
  const { books, hasHydrated: booksHydrated } = useBooksStore();
  const { notes, hasHydrated: notesHydrated } = useNotesStore();

  const hasHydrated = booksHydrated && notesHydrated;
  const nowMs = Date.now();

  const {
    events,
    weeklyNotes,
    weeklyFinishedBooks,
    lastWeeklyNote,
    hasAnyData,
  } = useMemo(() => {
    const hasAnyData = books.length > 0 || notes.length > 0;

    const weeklyNotes = notes.filter((note) =>
      isWithinLastNDays(note.createdAt, LAST_N_DAYS, nowMs)
    );

    const weeklyFinishedBooks = books.filter(
      (book) =>
        book.status === "read" &&
        isWithinLastNDays(book.updatedAt, LAST_N_DAYS, nowMs)
    );

    const lastWeeklyNote = sortByDateDesc(weeklyNotes, (n) => n.createdAt)[0];

    const events = buildTimelineEvents(books, notes);

    return {
      events,
      weeklyNotes,
      weeklyFinishedBooks,
      lastWeeklyNote,
      hasAnyData,
    };
  }, [books, notes, nowMs]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center px-screen">
        <Text className="text-sm font-sans text-text-muted">
          Preparing your timeline…
        </Text>
      </View>
    );
  }

  const hasWeeklyData =
    weeklyNotes.length > 0 || weeklyFinishedBooks.length > 0;

  return (
    <View className="flex-1 bg-surface-muted py-screen">
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-screen pb-8"
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={() => (
          <View>
            <View className="rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-base font-sansSemibold text-text">
                This week in your reading
              </Text>

              {!hasWeeklyData ? (
                <Text className="mt-3 text-sm font-sans text-text-muted">
                  Start reading and writing notes to see your weekly summary.
                </Text>
              ) : (
                <View className="mt-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Notes written
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {weeklyNotes.length}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row items-center justify-between">
                    <Text className="text-sm font-sans text-text-muted">
                      Books finished
                    </Text>
                    <Text className="text-sm font-sansSemibold text-text">
                      {weeklyFinishedBooks.length}
                    </Text>
                  </View>

                  <View className="mt-4">
                    <Text className="text-sm font-sans text-text-muted">
                      Last note this week
                    </Text>
                    {!!lastWeeklyNote ? (
                      <Text
                        className="mt-2 text-sm font-sans text-text"
                        numberOfLines={2}
                      >
                        {lastWeeklyNote.content}
                      </Text>
                    ) : (
                      <Text className="mt-2 text-sm font-sans text-text-subtle">
                        No notes yet this week.
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            <Text className="mt-6 text-base font-sansSemibold text-text">
              Activity
            </Text>

            <View className="h-3" />
          </View>
        )}
        renderItem={({ item }) => {
          const relative = formatRelativeTime(item.createdAt, nowMs);

          const description =
            item.type === "note"
              ? item.bookTitle
                ? `You wrote a note • ${item.bookTitle}`
                : "You wrote a note"
              : `You finished a book • ${item.bookTitle}`;

          return (
            <View className="rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sansSemibold text-text">
                {description}
              </Text>
              {!!relative && (
                <Text className="mt-2 text-xs font-sans text-text-muted">
                  {relative}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return !hasAnyData ? (
            <View className="mt-3 rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sans text-text-muted">
                No activity yet.
              </Text>
              <Text className="mt-1 text-sm font-sans text-text-subtle">
                Add a book or write a note to start your timeline.
              </Text>
            </View>
          ) : events.length === 0 ? (
            <View className="mt-3 rounded-card border border-border bg-surface px-card py-card">
              <Text className="text-sm font-sans text-text-muted">
                No recent activity to show.
              </Text>
              <Text className="mt-1 text-sm font-sans text-text-subtle">
                Write a note or finish a book to see updates here.
              </Text>
            </View>
          ) : (
            <View className="h-3" />
          );
        }}
      />
    </View>
  );
};

export default TimelineScreen;
