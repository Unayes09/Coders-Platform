import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Make sure axiosInstance is configured correctly
import CustomDivider from "../../components/Divider/CustomDivider";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import TestimonialsSection from "./TestimonialsSection";

import "./Home.css";
import toast from "react-hot-toast";

const Home = () => {
  const showQuoteToast = (quote) => {
    toast(
      <div className="text-center">
        <blockquote className="text-lg italic text-white">"{quote}"</blockquote>
        <p className="text-sm text-gray-400 mt-2">- CodersPlatform</p>
      </div>,
      {
        duration: 5000,
        position: "top-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
        },
      }
    );
  };

  useEffect(() => {
    // Fetch the quote when the component mounts
    const fetchQuote = async () => {
      try {
        const response = await axiosInstance.get("/api/qna/random"); // Update this URL as needed
        console.log(response.data.quote);
        showQuoteToast(response.data.quote);
      } catch (error) {
        console.error("Error fetching the quote:", error);
      }
    };

    fetchQuote();
  }, []);

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
