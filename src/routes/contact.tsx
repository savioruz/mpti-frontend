import { createFileRoute } from '@tanstack/react-router';
import { ContactSection } from '@/components/pages/contact';

export const Route = createFileRoute('/contact')({
  component: ContactSection,
});