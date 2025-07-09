import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/pages/about";
import { BenefitsSection } from "@/components/pages/vision";
import HeroPill from "@/components/pages/location"; // Import komponen HeroPill
import Footer from "@/components/pages/footer";

function AboutPage() {
  return (
    <>
      <Hero />
      <BenefitsSection />
      <HeroPill /> {/* Tampilkan komponen HeroPill di tab About */}
      <Footer />
    </>
  );
}

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
