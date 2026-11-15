import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SpecialitiesSection from "@/components/SpecialitiesSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import AsthmaAwarenessSection from "@/components/AsthmaAwarenessSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import TimingsAndContactSection from "@/components/TimingsAndContactSection";
import ConsultationHoursStickyNote from "@/components/ConsultationHoursStickyNote";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SpecialitiesSection />
        <FacilitiesSection />
        <AsthmaAwarenessSection />
        <WhyChooseSection />
        <TimingsAndContactSection />
      </main>
      <ConsultationHoursStickyNote />
      <Footer />
    </div>
  );
}
