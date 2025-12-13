export type BookStatus = 'to-read' | 'reading' | 'read';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  createdAt: string;
};
