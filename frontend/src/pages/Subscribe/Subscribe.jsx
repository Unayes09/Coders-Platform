import PlanCard from "./PlanCard";

const Subscribe = () => {
  return (
    <div>
      <h1 className="mt-6 text-center text-3xl font-semibold">
        Choose Your Plan
      </h1>
      <div className="flex justify-center items-start gap-5">
        <PlanCard plan={"free"} />
        <PlanCard plan={"premium"} />
      </div>
    </div>
  );
};

export default Subscribe;
