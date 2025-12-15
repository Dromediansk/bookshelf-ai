import { Note } from "@/types/note";

export const MOCK_NOTES: Note[] = [
  {
    id: "note_001",
    bookId: "bk_001",
    tags: ["sci-fi", "space"],
    content: "Loved the scientific accuracy in the space travel scenes.",
    createdAt: "2025-12-05T10:00:00.000Z",
  },
  {
    id: "note_002",
    bookId: "bk_001",
    tags: ["character", "development"],
    content: "The protagonist's growth throughout the story was inspiring.",
    createdAt: "2025-12-06T14:30:00.000Z",
  },
];
