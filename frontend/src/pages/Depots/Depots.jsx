import { useEffect, useState } from "react";
import { getUser } from "../../utils/getUser";
import axiosInstance from "../../utils/axiosInstance";
import CodeDepoCard from "./CodeDepoCard";
import DepotSearch from "./DepotSearch";
import { Spinner } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/react";
import toast from "react-hot-toast";

const Depots = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [publicDepots, setPublicDepots] = useState([]);
  const [searchedDepots, setSearchedDepots] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    axiosInstance.get("/api/repos/public").then((res) => {
      setPublicDepots(res.data);
      setSearchedDepots(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handlePublicSearch = (event) => {
    setIsLoading(true);
    event.preventDefault();

    if (searchText === "") {
      setIsLoading(false);
      setSearchedDepots(publicDepots);
      return;
    }

    axiosInstance
      .get(`api/repos/search?query=${searchText}`)
      .then((res) => {
        console.log(res.data);
        setSearchedDepots(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Sorry! Something went wrong");
        setIsLoading(false);
      });
  };

  return (
    <div className="mx-6 mt-2 pt-2">
      <Tabs aria-label="Options" color="secondary">
        {/* All Depots */}
        <Tab key="all" title="All Depots">
          <div>
            <DepotSearch
              searchText={searchText}
              setSearchText={setSearchText}
              setIsLoading={setIsLoading}
              allDepots={publicDepots}
              setSearchedDepots={setSearchedDepots}
              handleInputChange={handleInputChange}
              handleSearch={handlePublicSearch}
            />

            {!isLoading && searchedDepots.length === 0 && (
              <div className="h-[20vh] flex justify-center items-center">
                No depots found
              </div>
            )}

            {!isLoading &&
              searchedDepots.map((depo) => (
                <CodeDepoCard key={depo.id} depo={depo} />
              ))}

            {isLoading && (
              <div className="h-[40vh] flex justify-center items-center">
                <Spinner label="Loading" color="primary" labelColor="primary" />
              </div>
            )}
          </div>
        </Tab>

        {/* Logged-in user's depots */}
        <Tab key="my" title="My Depots">
          <div>
            <DepotSearch
              searchText={searchText}
              setSearchText={setSearchText}
              setIsLoading={setIsLoading}
              allDepots={publicDepots}
              setSearchedDepots={setSearchedDepots}
              handleInputChange={handleInputChange}
              handleSearch={handlePublicSearch}
            />
          </div>
        </Tab>

        {/* Create new depot */}
        <Tab key="new" title="New Depots">
          <div>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Depots;
