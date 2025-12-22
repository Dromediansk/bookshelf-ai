export const BOOK_STATUSES = ["to-read", "reading", "read"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

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
  "Graphic Novel",
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
