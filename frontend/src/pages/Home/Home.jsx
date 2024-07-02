import CustomDivider from "../../components/Divider/CustomDivider";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import "./Home.css";
import TestimonialsSection from "./TestimonialsSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <CustomDivider />
      <FeaturesSection />
      <CustomDivider />
      <TestimonialsSection />
    </>
  );
};

export default Home;
