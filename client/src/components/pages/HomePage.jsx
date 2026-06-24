import HeroSection from "../../components/home/HeroSection";
import WelcomeSection from "../../components/home/WelcomeSection";
import ServicesSection from "../../components/home/ServicesSection";
import DoctorsCarousel from "../../components/home/DoctorsCarousel";
import NewsGrid from "../../components/home/NewsGrid";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WelcomeSection />
      <ServicesSection />
      <DoctorsCarousel />
      <NewsGrid />
    </div>
  );
}
