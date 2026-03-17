import Hero from "@/components/home/Hero";
import SeasonalBanner from "@/components/home/SeasonalBanner";
import FeaturedCakes from "@/components/home/FeaturedCakes";
import ToppingsSection from "@/components/home/ToppingsSection";
import About from "@/components/home/About";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SeasonalBanner />
      <FeaturedCakes />
      <ToppingsSection />
      <About />
    </>
  );
}
