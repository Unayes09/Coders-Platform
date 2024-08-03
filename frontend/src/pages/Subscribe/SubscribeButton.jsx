import { Spinner } from "@nextui-org/react";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../providers/UserProvider";
import toast from "react-hot-toast";

const SubscribeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);

  const handleSubscribe = () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setIsLoading(true);
    const trxId = uuidv4();

    const postData = {
      store_id: "aamarpaytest",
      tran_id: trxId,
      success_url:
        "http://localhost:8080/api/users/confirm-payment?token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1bmF5ZXNraGFuLjA4MDhAZ21haWwuY29tIiwiaWF0IjoxNzIyNDkzODYwLCJleHAiOjE3MjI3NTMwNjB9.h43-dY5zX_3IXjBIqUNLkSMTGIEMznplQ_zVu09lBt5MQFqzXAnPanDY_5YgZwhEaD7iSsS8V5oE_iUQsmIOVw",
      fail_url: "http://localhost:8080/api/users/failed-payment",
      cancel_url: "http://localhost:5173/subscribe",
      amount: "1000.0",
      currency: "BDT",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      desc: "Merchant Registration Payment",
      cus_name: user.fullName,
      cus_email: user.email,
      cus_add1: user.address || "",
      cus_add2: user.address || "",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1234",
      cus_country: "Bangladesh",
      cus_phone: user.phone || "",
      type: "json",
    };

    axiosInstance
      .post("/api/payment/process", postData)
      .then((res) => {
        const newTabUrl = res.data?.payment_url;
        window.open(newTabUrl, "_blank");
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Sorry! Something went wrong");
        setIsLoading(false);
      });
  };
  return (
    <button
      disabled={isLoading}
      onClick={handleSubscribe}
      className="w-full md:translate-y-[15px] my-6 relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF,#393BB2_50%,#E2CBFF)]" />
      <span className=" hover:bg-gradient-to-r hover:from-[#9796f0] hover:to-[#fbc7d4] inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {isLoading && <Spinner color="white" />}
        {!isLoading && <span>Subscribe Now</span>}
      </span>
    </button>
  );
};

export default SubscribeButton;
