import FeatureCard from "./FeatureCard";
import aiFeedbackImg from "../../assets/images/ai-feedback.png";
import codeRepositoryImg from "../../assets/images/code-repository.png";
import onlineGroupImg from "../../assets/images/online-group.png";
import ShowMoreBtn from "../../components/ShowMoreBtn/ShowMoreBtn";

const FeaturesSection = () => {
  return (
    <div className="mx-6">
      <div className="py-20 bg-gradient-to-b">
        <h3 className="text-3xl font-bold text-center mb-10">Features</h3>
        <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 justify-center">
          <FeatureCard
            image={aiFeedbackImg}
            title={"AI-Powered Code Feedback"}
            subTitle={"Detailed logs and suggestions to improve your code."}
          />
          <FeatureCard
            image={codeRepositoryImg}
            title={"Personal Code Repository"}
            subTitle={"Save and manage your code snippets."}
          />
          <FeatureCard
            image={onlineGroupImg}
            title={"Online Coding Groups"}
            subTitle={"Collaborate on coding projects with others."}
          />
        </div>
        <div className="mt-10 flex justify-center items-center">
          <ShowMoreBtn text={"See More"} />
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
