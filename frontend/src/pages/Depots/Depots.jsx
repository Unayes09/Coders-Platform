import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import CodeDepoCard from "./CodeDepoCard";
import DepotSearch from "./DepotSearch";
import { Spinner } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/react";
import toast from "react-hot-toast";
import { UserContext } from "../../providers/UserProvider";
import NewDepotForm from "./NewDepotForm";

// TODO: implement pagination
const Depots = () => {
  const { user, isUserLoading } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [publicDepots, setPublicDepots] = useState([]);
  const [privateDepots, setPrivateDepots] = useState([]);
  const [searchedPrivateDepots, setSearchedPrivateDepots] = useState([]);
  const [searchedDepots, setSearchedDepots] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    axiosInstance.get("/api/repos/public").then((res) => {
      setPublicDepots(res.data.reverse());
      setSearchedDepots(res.data);
      setIsLoading(false);
    });
  }, [refetch]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      axiosInstance
        .get(`/api/repos/${user.id}/repos`, {
          params: {
            token: user?.token || null,
          },
        })
        .then((res) => {
          setPrivateDepots(res.data.reverse());
          setSearchedPrivateDepots(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setPrivateDepots([]);
          setSearchedPrivateDepots([]);
          setIsLoading(false);
        });
    } else {
      setPrivateDepots([]);
      setSearchedPrivateDepots([]);
    }
  }, [user, refetch]);

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
        setSearchedDepots(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Sorry! Something went wrong");
        setIsLoading(false);
      });
  };

  const handlePrivateSearch = (event) => {
    setIsLoading(true);
    event.preventDefault();

    if (searchText === "") {
      setIsLoading(false);
      setSearchedPrivateDepots(privateDepots);
      return;
    }

    const searchQuery = searchText.toLowerCase().trim();

    const results = privateDepots.filter((depot) =>
      depot.repoName.toLowerCase().includes(searchQuery)
    );

    setSearchedPrivateDepots(results);
    setIsLoading(false);
  };

  return (
    <div className="mx-6 mt-2 pt-2 pb-6">
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
            {!isLoading &&
              !isUserLoading &&
              user &&
              privateDepots.length !== 0 && (
                <DepotSearch
                  searchText={searchText}
                  setSearchText={setSearchText}
                  setIsLoading={setIsLoading}
                  allDepots={privateDepots}
                  setSearchedDepots={setSearchedPrivateDepots}
                  handleInputChange={handleInputChange}
                  handleSearch={handlePrivateSearch}
                />
              )}

            {!isLoading && !isUserLoading && !user && (
              <div className="h-[20vh] flex justify-center items-center">
                Please log in first
              </div>
            )}

            {!isLoading &&
              !isUserLoading &&
              user &&
              privateDepots.length === 0 && (
                <div className="h-[20vh] flex justify-center items-center">
                  Please create depots first.
                </div>
              )}

            {!isLoading &&
              !isUserLoading &&
              user &&
              privateDepots.length !== 0 &&
              searchedPrivateDepots.map((depo) => (
                <CodeDepoCard key={depo.id} depo={depo} />
              ))}

            {(isLoading || isUserLoading) && (
              <div className="h-[40vh] flex justify-center items-center">
                <Spinner label="Loading" color="primary" labelColor="primary" />
              </div>
            )}
          </div>
        </Tab>
        <Tab key="new" title="Create Depot">
          {!isLoading && !isUserLoading && !user && (
            <div className="h-[20vh] flex justify-center items-center">
              Please log in first
            </div>
          )}

          {!isLoading && !isUserLoading && user && (
            <NewDepotForm refetch={refetch} setRefetch={setRefetch} />
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Depots;
