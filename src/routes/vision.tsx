import { createFileRoute } from '@tanstack/react-router';
import { BenefitsSection } from '@/components/pages/vision';

export const Route = createFileRoute('/vision')({
  component: BenefitsSection,
});