import PlanCard from "./PlanCard";
import { freePlan, premiumPlan } from "./subscriptionPlans";

const Subscribe = () => {
  return (
    <div className="pb-20">
      <h1 className="mt-6 mb-10 text-center text-3xl font-semibold">
        Choose Your Plan
      </h1>
      <div className="max-w-3xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlanCard plan={"free"} />
          <PlanCard plan={"premium"} />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
