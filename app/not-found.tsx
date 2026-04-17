import css from "./Home.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description:
    "This page does not exist. The requested page could not be found.",
  openGraph: {
    title: "404 — Page Not Found",
    description:
      "This page does not exist. The requested page could not be found.",
    url: "https://07-routing-nextjs-indol-nu.vercel.app/",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
