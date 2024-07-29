import SubscribeButton from "./SubscribeButton";

const PlanCard = ({ plan }) => {
  return (
    <div className="bg-gradient-to-b from-[#F7971E] to-[#FFD200] rounded-lg h-[300px] w-[250px]">
      <h1>This is {plan} plan</h1>

      {plan === "premium" && <SubscribeButton />}
    </div>
  );
};

export default PlanCard;
