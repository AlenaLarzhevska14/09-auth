import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

type NotesHttpResponse = {
  notes: Note[];
  totalPages: number;
};

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function checkSession(): Promise<User | null> {
  const { data } = await api.get<User | null | "">("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  if (!data || typeof data !== "object" || !("email" in data)) {
    return null;
  }

  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
  return data;
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

  const { data } = await api.get<NotesHttpResponse>("/notes", {
    params,
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
  return data;
}
