import { createFileRoute } from "@tanstack/react-router";
import { FeaturesSection } from "@/components/pages/features";

export const Route = createFileRoute("/features")({
  component: FeaturesSection,
});
