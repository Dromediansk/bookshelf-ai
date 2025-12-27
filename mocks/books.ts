import { Book } from "@/types/book";

export const MOCK_BOOKS: Book[] = [
  {
    id: "bk_001",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    status: "reading",
    createdAt: "2025-12-01T09:00:00.000Z",
    updatedAt: "2025-12-20T09:15:00.000Z",
    description: "A thrilling sci-fi adventure about a lone astronaut.",
    insightIds: ["insight_001", "insight_002"],
  },
  {
    id: "bk_002",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    status: "to-read",
    createdAt: "2025-11-20T18:30:00.000Z",
    updatedAt: "2025-11-20T18:30:00.000Z",
    description:
      "An epic fantasy tale of a gifted young musician and magician.",
    insightIds: [],
  },
  {
    id: "bk_003",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Non-Fiction",
    status: "finished",
    createdAt: "2025-10-02T07:15:00.000Z",
    updatedAt: "2025-12-19T20:10:00.000Z",
    description: "A guide to building good habits and breaking bad ones.",
    insightIds: [],
  },
  {
    id: "bk_004",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    status: "to-read",
    createdAt: "2025-12-10T12:00:00.000Z",
    updatedAt: "2025-12-10T12:00:00.000Z",
    description: "A science fiction saga set on the desert planet Arrakis.",
    insightIds: [],
  },
];
