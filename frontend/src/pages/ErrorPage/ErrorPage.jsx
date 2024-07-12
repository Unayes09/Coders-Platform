import Lottie from "react-lottie";
import errorAnimationData from "../../assets/lottieFiles/ErrorPageAnimation.json";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimationData,
  };

  return (
    <div className="bg-[#222837]">
      <div className="text-[20px] h-[15vh] flex items-center justify-end flex-col">
        <span className="text-[#F871A0]">Ops! Page Not Found</span>
        <Link className="text-[#A2E9C1]" to="/">
          Go back to Home
        </Link>
      </div>
      <div className="h-[85vh]">
        <Lottie options={defaultOptions} />
      </div>
    </div>
  );
};

export default ErrorPage;
