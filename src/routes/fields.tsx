import { createFileRoute } from "@tanstack/react-router";
import { DatetimePickerV1 } from "@/components/pages/fields";

export const Route = createFileRoute("/fields")({
  component: DatetimePickerV1,
});
