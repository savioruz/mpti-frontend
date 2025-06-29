import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '@/components/pages/alkadi';
import { FeaturesSection } from "@/components/pages/features";
import { FAQSection } from "@/components/pages/faq";
import { ServicesSection } from "@/components/pages/services";
import Footer from "@/components/pages/footer";

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <FAQSection />
      <Footer />
    </>
  ),
});
