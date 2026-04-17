"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";

import css from "./NotePreview.module.css";

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !data) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  const formattedCreatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(data.createdAt));

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{data.title}</h2>
          </div>
          <p className={css.tag}>{data.tag}</p>
          <p className={css.content}>{data.content}</p>
          <p className={css.date}>{formattedCreatedAt}</p>
          <button
            type="button"
            className={css.backBtn}
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
