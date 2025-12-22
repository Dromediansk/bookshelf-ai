export const BOOK_STATUSES = ["to-read", "reading", "read"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export const BOOK_GENRES = [
  "Unknown",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Romance",
  "Nonfiction",
  "Biography",
  "History",
] as const;
export type BookGenre = (typeof BOOK_GENRES)[number];

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  cover?: string;
  noteIds: string[];
};
