"use client";

interface NotesFilterErrorProps {
  error: Error & { digest?: string };
}

export default function NotesFilterError({ error }: NotesFilterErrorProps) {
  return <p>Could not fetch filtered notes. {error.message}</p>;
}
