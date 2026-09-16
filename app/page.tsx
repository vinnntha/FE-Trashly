import Navbar from "./(marketing)/components/Navbar";
import Hero from "./(marketing)/components/Hero";
import TrustRow from "./(marketing)/components/TrustRow";
import AboutSection from "./(marketing)/components/AboutSection";
import FeatureGrid from "./(marketing)/components/FeatureGrid";
import CtaSteps from "./(marketing)/components/CtaSteps";
import FaqSection from "./(marketing)/components/FaqSection";
import Footer from "./(marketing)/components/Footer";
import { ScrollProgress } from "./(marketing)/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#EFF0EB] text-[#0B636B] relative">
      {/* Scroll Progress Bar & Floating Back-To-Top Button */}
      <ScrollProgress />

      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Hero with Interactive Waste-to-Reward Calculator */}
      <Hero />

      {/* Interactive Category Inspector & Accepted/Rejected Criteria */}
      <TrustRow />

      {/* About Section with Persona Switcher (Nasabah vs Pengelola) */}
      <AboutSection />

      {/* Bento Grid: IoT Scale, Digital Receipt & Reward System */}
      <FeatureGrid />

      {/* 3-Step Walkthrough with Dynamic Interactive State */}
      <CtaSteps />

      {/* Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
