import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const SingleDepot = () => {
  const [depot, setDepot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  // implement use axios secure
  // if it is a private repo than check if the user matches or not!!!
  // if user does not match than logout the user and redirect him to login page!!!
  useEffect(() => {
    axiosInstance
      .get(`http://localhost:8080/api/repos/${id}/files`)
      .then((res) => {
        console.log(res.data);
        setDepot(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setDepot([]);
        setIsLoading(false);
        navigate("/404");
      });
  }, [id, navigate]);

  return (
    <div>
      <h1>Depot Details</h1>
      <p>Depot ID: {id}</p>
    </div>
  );
};

export default SingleDepot;
