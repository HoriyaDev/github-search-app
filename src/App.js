import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async (query, page) => {
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const response = await axios.get(
    `https://api.github.com/search/users?q=${query}&page=${page}&per_page=6`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  console.log(response.data.items)
  return response.data; 
};

const App = () => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  
  const { data, isLoading, error } = useQuery({
    queryKey: ["searchUsers", searchQuery, page],
    queryFn: () => fetchUsers(searchQuery, page),
    keepPreviousData: true,
    enabled: !!searchQuery, 
  });

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query);
      setPage(1); 
      setQuery(""); 
    }
  };

  const handlePrevious = () => {
    setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const getTotalPages = () => {
    if (data && data.total_count) {
      return Math.ceil(data.total_count / 6); 
    }
    return 1;
  };

  return (
    <div className="bg-red-700 mx-auto w-[900px] mt-6 rounded-lg p-5">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for GitHub users"
        className="w-[550px] py-2 px-1 outline-none rounded-sm ml-28"
      />
      <button
        className="bg-red-300 ml-2 px-3 py-2 rounded-sm"
        onClick={handleSearch}
      >
        Search
      </button>
      <ul className="flex flex-wrap gap-4 mt-5">
        {isLoading && <p className="text-xl text-white">Loading...</p>}
        {error && <p className="text-white text-xl">Error: {error.message}</p>}
        {data && data.items && data.items.length > 0 ? (
          data.items.map((user) => (
            <li
              key={user.id}
              className="bg-red-200 flex p-4 rounded-lg w-[48%] border border-orange-100"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-20 h-20 rounded"
              />
              <div className="flex flex-col ml-5">
                <p className="font-semibold text-2xl">{user.login}</p>
                <a href={user.html_url} target="_blank" rel="noreferrer">
                  <button className="bg-red-100 px-2 py-1 rounded hover:bg-red-300 mt-1">
                    View Profile
                  </button>
                </a>
              </div>
            </li>
          ))
        ) : (
          <p className="text-white mx-auto text-xl font-semibold">
            {data && data.items ? "No users found" : "Search for GitHub users"}
          </p>
        )}
      </ul>

      <div className="flex justify-between mt-5">
        <button
          disabled={page === 1}
          className="bg-red-300 px-3 py-2 rounded-sm"
          onClick={handlePrevious}
        >
          Previous
        </button>

        <span className="text-white font-semibold">
          Page {page} of {getTotalPages()}
        </span>

        <button
          disabled={page === getTotalPages()}
          className="bg-red-300 px-3 py-2 rounded-sm"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
