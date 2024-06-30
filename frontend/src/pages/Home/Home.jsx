import CustomDivider from "../../components/Divider/CustomDivider";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import "./Home.css";

const Home = () => {
  return (
    <>
      <HeroSection />
      <CustomDivider />
      <FeaturesSection />
      <CustomDivider />
    </>
  );
};

export default Home;
