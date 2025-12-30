import { BookStatus } from "@/types/book";

export const BOOK_STATUS_PRIORITY: Record<BookStatus, number> = {
  reading: 0,
  "to-read": 1,
  finished: 2,
};

export const BOOK_GENRES = [
  "Unknown",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Health",
  "Travel",
  "Children's",
  "Young Adult",
  "Horror",
  "Thriller",
  "Non-Fiction",
  "Fiction",
  "Poetry",
  "Classic",
  "Novel",
  "Religion",
  "Philosophy",
  "Science",
  "Art",
  "Cooking",
  "Business",
  "Economics",
  "Finance",
  "Politics",
  "Education",
  "Music",
  "Sports",
  "Comics",
];

export const BOOK_STATUSES = ["to-read", "reading", "finished"];

export const LAST_N_DAYS = 7;
