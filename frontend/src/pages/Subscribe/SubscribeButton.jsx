import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SubscribeButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const trxId = uuidv4();

  const postData = {
    store_id: "aamarpaytest",
    tran_id: trxId,
    success_url: `http://localhost:5173/subscribe/success/${trxId}`,
    fail_url: "http://localhost:5173/subscribe/failed",
    cancel_url: "http://localhost:5173/subscribe/cancelled",
    amount: "10.0",
    currency: "BDT",
    signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
    desc: "Merchant Registration Payment",
    cus_name: "Name",
    cus_email: "payer@merchantcustomer.com",
    cus_add1: "House B-158 Road 22",
    cus_add2: "Mohakhali DOHS",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: "+8801704",
    type: "json",
  };

  const handleSubscribe = () => {
    setIsLoading(true);

    axios
      .post(
        "https://cors-anywhere.herokuapp.com/https://sandbox.aamarpay.com/jsonpost.php",
        postData
      )
      .then((response) => {
        console.log("Response:", response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };
  return (
    <Button
      className="w-[150px]"
      disabled={isLoading}
      onClick={handleSubscribe}
    >
      {isLoading && <Spinner />}
      {!isLoading && <span>Subscribe Now</span>}
    </Button>
  );
};

export default SubscribeButton;
