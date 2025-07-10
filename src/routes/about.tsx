import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/pages/about";

function AboutPage() {
  return (
      <Hero />
  );
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
