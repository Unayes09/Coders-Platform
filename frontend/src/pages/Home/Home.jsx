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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800">Testimonials</h3>
          <div className="mt-10 space-y-8">
            <div className="bg-white p-6 rounded shadow-md">
              <p className="text-gray-700">
                "Coders Platform has transformed my coding journey. The AI
                feedback is spot on!"
              </p>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                - Jane Doe
              </h4>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <p className="text-gray-700">
                "The collaborative groups feature is fantastic. I've met so many
                like-minded coders."
              </p>
              <h4 className="mt-4 text-xl font-bold text-gray-800">
                - John Smith
              </h4>
            </div>
            {/* Add more testimonials here */}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800">Upcoming Events</h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-6 rounded shadow-md">
              <h4 className="text-xl font-bold text-gray-800">
                Coding Bootcamp
              </h4>
              <p className="text-gray-600 mt-4">
                Join our intensive coding bootcamp this summer.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded shadow-md">
              <h4 className="text-xl font-bold text-gray-800">
                Hackathon 2024
              </h4>
              <p className="text-gray-600 mt-4">
                Participate in our upcoming hackathon and win prizes.
              </p>
            </div>
            {/* Add more event cards here */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 Coders Platform. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="#privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#support" className="hover:underline">
              Support
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
