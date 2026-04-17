import axios from "axios";
import type { NewNote, Note, NoteTag } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async (
  searchQuery: string,
  page: number,
  tag?: NoteTag
): Promise<NotesHttpResponse> => {
  const params = {
    search: searchQuery,
    page,
    perPage: 12,
    ...(tag ? { tag } : {}),
  };

  const { data } = await api.get<NotesHttpResponse>("/notes", {
    params,
  });

  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", newNote);

  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
