import { createFileRoute } from '@tanstack/react-router';
import Footer from '@/components/pages/footer';

export const Route = createFileRoute('/footer')({
  component: Footer,
});