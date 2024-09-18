import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Make sure axiosInstance is configured correctly
import CustomDivider from "../../components/Divider/CustomDivider";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import TestimonialsSection from "./TestimonialsSection";
import "./Home.css";

const Home = () => {
  const [quote, setQuote] = useState(""); // State to hold the fetched quote

  useEffect(() => {
    // Fetch the quote when the component mounts
    const fetchQuote = async () => {
      try {
        const response = await axiosInstance.get("/api/qna/random"); // Update this URL as needed
        setQuote(response.data.quote); // Assuming the quote is in response.data.quote
      } catch (error) {
        console.error("Error fetching the quote:", error);
        setQuote("Default inspirational quote"); // Set a fallback quote in case of an error
      }
    };

    fetchQuote();
  }, []);

  return (
    <>
      <div className="quote-container flex flex-col items-center justify-center pt-6 text-center">
        {/* Display the fetched quote or a default message */}
        <div className="text-4xl font-semibold text-purple-700 mb-2">
          {quote ? `"${quote}"` : "Loading..."}
        </div>
        <div className="text-xl text-gray-500 italic">
          - Coder's Platform
        </div>
      </div>
      <HeroSection />
      <CustomDivider />
      <FeaturesSection />
      <CustomDivider />
      <TestimonialsSection />
    </>
  );
};

export default Home;
