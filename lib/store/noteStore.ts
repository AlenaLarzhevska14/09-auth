import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

type DraftNote = {
  title: string;
  content: string;
  tag: NoteTag;
};

type NoteDraftStore = {
  draft: DraftNote;
  setDraft: (note: Partial<DraftNote>) => void;
  clearDraft: () => void;
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),

      clearDraft: () =>
        set(() => ({
          draft: initialDraft,
        })),
    }),
    {
      name: "note-draft-storage",
    }
  )
);
