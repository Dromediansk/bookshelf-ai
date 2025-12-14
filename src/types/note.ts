export type Note = {
  id: string;
  bookId: string;
  tags: string[];
  content: string;
  createdAt: string;
};

export const NOTE_MODES = ["none", "add", "edit"] as const;
export type NoteMode = (typeof NOTE_MODES)[number];
