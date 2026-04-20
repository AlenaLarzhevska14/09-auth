import { api } from "./api";
import type { NewNote, Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

type NotesHttpResponse = {
  notes: Note[];
  totalPages: number;
};

type SessionResponse = User | { success: boolean } | null | "";

function isUser(data: SessionResponse): data is User {
  return Boolean(data && typeof data === "object" && "email" in data);
}

export async function fetchNotes(
  searchQuery: string,
  page: number,
  tag?: NoteTag
): Promise<NotesHttpResponse> {
  const params = {
    search: searchQuery,
    page,
    perPage: 12,
    ...(tag ? { tag } : {}),
  };

  const { data } = await api.get<NotesHttpResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NewNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

type RegisterData = {
  email: string;
  password: string;
};

export async function register(params: RegisterData): Promise<User> {
  const { data } = await api.post<User>("/auth/register", params);
  return data;
}

type LoginData = {
  email: string;
  password: string;
};

export async function login(params: LoginData): Promise<User> {
  const { data } = await api.post<User>("/auth/login", params);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<SessionResponse>("/auth/session");

  if (isUser(data)) {
    return data;
  }

  if (data && typeof data === "object" && "success" in data && data.success) {
    return getMe();
  }

  return null;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

type UpdateMeData = {
  username: string;
};

export async function updateMe(params: UpdateMeData): Promise<User> {
  const { data } = await api.patch<User>("/users/me", params);
  return data;
}
