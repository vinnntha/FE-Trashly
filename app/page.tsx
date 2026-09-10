import Navbar from "./(marketing)/components/Navbar";
import Hero from "./(marketing)/components/Hero";
import TrustRow from "./(marketing)/components/TrustRow";
import AboutSection from "./(marketing)/components/AboutSection";
import FeatureGrid from "./(marketing)/components/FeatureGrid";
import CtaSteps from "./(marketing)/components/CtaSteps";
import Footer from "./(marketing)/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#EFF0EB] text-[#0B636B]">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Asymmetric Hero with Floating Point Card & Circular Metaphor */}
      <Hero />

      {/* Trust Row: Accepted Waste Categories with Verification Badges */}
      <TrustRow />

      {/* About Section: Story, Mission & Community Impact */}
      <AboutSection />

      {/* Feature Grid: Documentary Photo + Tiered Color Cards */}
      <FeatureGrid />

      {/* Deep Teal CTA & 1-2-3 Sequence */}
      <CtaSteps />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
