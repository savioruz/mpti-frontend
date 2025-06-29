import { createFileRoute } from '@tanstack/react-router';
import { ServicesSection } from '@/components/pages/services';

export const Route = createFileRoute('/services')({
  component: ServicesSection,
});