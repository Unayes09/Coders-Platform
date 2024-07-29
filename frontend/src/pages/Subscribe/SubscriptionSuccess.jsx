import { useParams } from "react-router-dom";

const SubscriptionSuccess = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>SUbscription successful</h1>
      <h2>TrxId: {id}</h2>
    </div>
  );
};

export default SubscriptionSuccess;
