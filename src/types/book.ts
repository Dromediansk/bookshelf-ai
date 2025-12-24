import { BOOK_GENRES, BOOK_STATUSES } from "@/utils/contants";

export type BookStatus = (typeof BOOK_STATUSES)[number];

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
