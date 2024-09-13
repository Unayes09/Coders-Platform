import { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [news, setNews] = useState([]);
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("publishedAt");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const demoImage = "https://via.placeholder.com/150"; // Placeholder image

  // Function to get the current month's first and last day
  const getCurrentMonthDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setFromDate(firstDay);
    setToDate(lastDay);
    return { firstDay, lastDay };
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: content || "latest", // Default search term if input is empty
          from: fromDate,
          to: toDate,
          sortBy: sortBy,
          apiKey: "26654f2fd94c4dbfbf4150de12358221", // Replace with your NewsAPI key
        },
      });
      setNews(response.data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch news for the current month when the component mounts
    const { firstDay, lastDay } = getCurrentMonthDates();
    setFromDate(firstDay);
    setToDate(lastDay);
    handleSearch();
  }, []);

  const truncateContent = (content, length = 150) => {
    return content && content.length > length
      ? content.substring(0, length) + "..."
      : content;
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">News Search</h1>

      {/* Search Bar */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Search content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
        >
          <option value="publishedAt">Newest</option>
          <option value="popularity">Popularity</option>
          <option value="relevancy">Relevant</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* News Cards */}
          {news.length > 0 ? (
            news.map((article, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={article.urlToImage || demoImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Author:</strong> {article.author || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Source:</strong> {article.source.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Published:</strong>{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">
              No news found. Try another search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default News;
