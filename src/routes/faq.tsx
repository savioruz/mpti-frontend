import { createFileRoute } from "@tanstack/react-router";
import { FAQSection } from "@/components/pages/faq";

export const Route = createFileRoute("/faq")({
  component: FAQSection,
});
