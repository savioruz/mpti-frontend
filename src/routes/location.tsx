import { createFileRoute } from "@tanstack/react-router";
import HeroPill from "@/components/pages/location";

export const Route = createFileRoute("/location")({
  component: HeroPill,
});
