import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

const NOTE_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

interface NotesFilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const isNoteTag = (value: string): value is NoteTag =>
  NOTE_TAGS.includes(value as NoteTag);

export async function generateMetadata({
  params,
}: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [filterName] = slug;

  return {
    title: `Notes filtered by: ${filterName}`,
    description: `Browse notes filtered by the selected category: ${filterName}.`,
    openGraph: {
      title: `Notes filtered by: ${filterName}`,
      description: `Browse notes filtered by the selected category: ${filterName}.`,
      url: `https://07-routing-nextjs-indol-nu.vercel.app/notes/filter/${filterName}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { slug } = await params;

  if (slug.length !== 1) {
    notFound();
  }

  const [selectedFilter] = slug;
  let selectedTag: NoteTag | undefined;

  if (selectedFilter !== "all") {
    if (!isNoteTag(selectedFilter)) {
      notFound();
    }

    selectedTag = selectedFilter;
  }

  const queryClient = new QueryClient();
  const notesQueryKey = ["notes", "", 1, selectedTag ?? "all"];

  await queryClient.prefetchQuery({
    queryKey: notesQueryKey,
    queryFn: () => fetchNotes("", 1, selectedTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={selectedTag ?? "all"} tag={selectedTag} />
    </HydrationBoundary>
  );
}
