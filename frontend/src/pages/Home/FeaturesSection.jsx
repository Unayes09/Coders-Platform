import FeatureCard from "./FeatureCard";
import aiFeedbackImg from "../../assets/images/ai-feedback.png";
import codeRepositoryImg from "../../assets/images/code-repository.png";
import onlineGroupImg from "../../assets/images/online-group.png";
import chatbotImg from "../../assets/images/chatbot.png";
import qnaImg from "../../assets/images/qna.png";
import newsImg from "../../assets/images/news.png";
import cvImg from "../../assets/images/cv.png";
import jobImg from "../../assets/images/job.png";
import eventImg from "../../assets/images/event.png";
import achievementImg from "../../assets/images/achievement.png";
import certificateImg from "../../assets/images/certificate.png";
import analysisImg from "../../assets/images/analysis.png";
import scheduleImg from "../../assets/images/schedule.png";
import restImg from "../../assets/images/rest.png";
import messagingImg from "../../assets/images/messaging.png";
import ShowMoreBtn from "../../components/ShowMoreBtn/ShowMoreBtn";
import { useState } from "react";

const FeaturesSection = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="mx-6">
      <div className="py-20 bg-gradient-to-b">
        {/* Section title */}
        <h3 className="text-3xl font-bold text-center mb-10">Features</h3>

        {/* Container for feature cards, with responsive grid layout */}
        <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 justify-center">
          {/* Feature card for AI-Powered Code Feedback */}
          <FeatureCard
            image={aiFeedbackImg}
            title={"AI-Powered Code Feedback"}
            subTitle={"Detailed logs and suggestions to improve your code."}
          />

          {/* Feature card for Personal Code Repository */}
          <FeatureCard
            image={codeRepositoryImg}
            title={"Personal Code Repository"}
            subTitle={"Save and manage your code snippets."}
          />

          {/* Feature card for Chatbot */}
          <FeatureCard
            image={chatbotImg}
            title={"Chatbot"}
            subTitle={
              "Your AI-powered coding assistant. Ask anything, get answers."
            }
          />

          {/* Feature card for Online Coding Groups */}
          <FeatureCard
            image={onlineGroupImg}
            title={"Online Coding Groups"}
            subTitle={"Collaborate on coding projects with others."}
          />

          {/* Feature card for Personalized News Feed */}

          <FeatureCard
            image={newsImg}
            title={"Personalized News Feed"}
            subTitle={
              "Stay up-to-date with what matters to you. Your news, customized for you."
            }
          />

          {/* Feature card for Personalized Learning Schedule */}
          <FeatureCard
            image={scheduleImg}
            title={"Personalized Learning Schedule"}
            subTitle={
              "Learn effectively and efficiently. Our schedule will help you reach your goals in your own time."
            }
          />

          {/* Feature card for Skill Gap Analysis */}
          {showMore && (
            <FeatureCard
              image={analysisImg}
              title={"Skill Gap Analysis"}
              subTitle={
                "Identify your areas of growth and develop your skills. Our analysis will help you reach your career goals."
              }
            />
          )}

          {/* Feature card for Skills Assessment and Certification */}
          {showMore && (
            <FeatureCard
              image={certificateImg}
              title={"Skills Assessment and Certification"}
              subTitle={
                "Validate your skills and earn recognition. Take our skills tests and get certified."
              }
            />
          )}

          {/* Feature card for Rest Notifications */}
          {showMore && (
            <FeatureCard
              image={restImg}
              title={"Rest Notifications"}
              subTitle={
                "Take a break and recharge. Our system will remind you to rest when you need it most."
              }
            />
          )}

          {/* Feature card for Virtual CV Creation */}
          {showMore && (
            <FeatureCard
              image={cvImg}
              title={"Virtual CV Creation"}
              subTitle={
                "Showcase your work in style. Create a professional virtual CV that highlights your projects and achievements."
              }
            />
          )}

          {/* Feature card for Job Finding */}
          {showMore && (
            <FeatureCard
              image={jobImg}
              title={"Job Finding"}
              subTitle={
                "Find your dream job and ace the interview. Your one-stop shop for career opportunities."
              }
            />
          )}

          {/* Feature card for Achievements and Stories Sharing */}
          {showMore && (
            <FeatureCard
              image={achievementImg}
              title={"Achievements Sharing"}
              subTitle={
                "Inspire others and share your journey. Celebrate your successes and tell your stories."
              }
            />
          )}

          {/* Feature card for Event Creation */}
          {showMore && (
            <FeatureCard
              image={eventImg}
              title={"Event Creation"}
              subTitle={
                "Connect with others and share your passions. Create and join events that interest you."
              }
            />
          )}

          {/* Feature card for Q&A */}
          {showMore && (
            <FeatureCard
              image={qnaImg}
              title={"Topic-wise Q&A"}
              subTitle={"Connect with the community and learn together."}
            />
          )}

          {/* Feature card for Direct Messaging */}
          {showMore && (
            <FeatureCard
              image={messagingImg}
              title={"Direct Messaging"}
              subTitle={
                "Connect with friends and colleagues privately. Send direct messages to anyone on the platform."
              }
            />
          )}
        </div>

        {/* Container for the 'See More' button */}
        <div className="mt-10 flex justify-center items-center">
          <ShowMoreBtn
            text={showMore ? "See Less" : "See More"}
            showMore={showMore}
            setShowMore={setShowMore}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
