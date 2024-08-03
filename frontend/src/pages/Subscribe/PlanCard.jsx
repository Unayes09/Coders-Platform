import BackgroundGradient from "../../components/BackgroundGradient/BackgroundGradient";
import SubscribeButton from "./SubscribeButton";
import { TiTick } from "react-icons/ti";
import { TiTimes } from "react-icons/ti";
import { freePlan, premiumPlan } from "./subscriptionPlans";
import { capitalizeWords } from "../../utils/capitalizeWords";
import fiveStarsLogo from "../../assets/images/five_stars.png";
import threeStarsLogo from "../../assets/images/three_stars.png";

const PlanCard = ({ plan }) => {
  const premiumFeatures = premiumPlan;
  const freeFeatures = freePlan;

  return (
    <BackgroundGradient className="h-full cursor-pointer rounded-[22px] w-full p-4 sm:p-10 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-left">
        <img
          draggable={false}
          src={plan === "premium" ? fiveStarsLogo : threeStarsLogo}
          className="h-[40px] w-auto"
        />
      </div>
      <p className="text-2xl tracking-wide font-semibold text-black my-2 dark:text-neutral-200">
        {capitalizeWords(plan)}
      </p>

      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        <ul>
          {freeFeatures &&
            freeFeatures.map((feature) => (
              <li key={feature} className="flex gap-2 items-center">
                <TiTick />
                {feature}
              </li>
            ))}

          {premiumFeatures &&
            freeFeatures &&
            premiumFeatures
              .filter((item) => !freeFeatures.includes(item))
              .map((feature) => (
                <li
                  key={feature}
                  className={`flex gap-2 items-center ${
                    plan === "free" && "text-neutral-600"
                  }`}
                >
                  {plan === "free" && <TiTimes />}
                  {plan === "premium" && <TiTick />}
                  {feature}
                </li>
              ))}
        </ul>
      </div>
      {plan === "premium" && (
        <p className="mt-5 -mb-3 text-neutral-300">
          <span className="text-orange-300 font-bold">1000 BDT</span> for four
          months
        </p>
      )}
      <div>{plan === "premium" && <SubscribeButton />}</div>
    </BackgroundGradient>
  );
};

export default PlanCard;
