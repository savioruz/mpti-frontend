import { createFileRoute } from "@tanstack/react-router";
import LocationPage from "@/components/pages/location";

export const Route = createFileRoute("/location")({
  component: LocationPage,
});
