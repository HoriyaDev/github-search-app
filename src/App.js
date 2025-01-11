import React, { useState } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
import ProfileModel from "./components/ProfileModel";

// Fetch the list of users based on the search query
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
  return response.data;
};

// Fetch detailed data for a specific user
const fetchUserDetails = async (username) => {
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const response = await axios.get(
    `https://api.github.com/users/${username}`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );
  console.log(response.data)
  return response.data;
};

const App = () => {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [profileModel, setProfileModel] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Query to search for users
  const { data, isLoading, error } = useQuery({
    queryKey: ["searchUsers", searchQuery, page],
    queryFn: () => fetchUsers(searchQuery, page),
    enabled: !!searchQuery,  // Only run the query if there's a search term
  });
  
  // Query to fetch detailed data for the selected user
  const { data: userDetails, isLoading: userLoading } = useQuery({
    queryKey: ["userDetails", selectedUser?.login],
    queryFn: () => selectedUser && fetchUserDetails(selectedUser.login),
    enabled: !!selectedUser,  // Only fetch user details if a user is selected
  });
  

  const handleProfileModel = (user) => {
    setSelectedUser(user);
    setProfileModel(true);
  };

  const handleCloseProfile = () => {
    setProfileModel(false);
    setSelectedUser(null);
  };

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

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <>
      <header className="bg-slate-200 p-5 dark:bg-slate-700 flex justify-between items-center text-2xl font-serif text-black dark:text-white">
        Github Search Page
        <button onClick={darkModeHandler}>
          {dark ? <MdOutlineLightMode /> : <MdDarkMode />}
        </button>
      </header>
      <main className={`bg-slate-200 p-5 dark:bg-slate-700 mt-12 ${dark ? 'dark' : ''}`}>
        <div className="flex justify-center relative">
          <div className="flex flex-col md:flex-row items-center gap-1 -translate-y-10">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-64 md:w-80 lg:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-800 dark:text-white dark:border-slate-600"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-200 text-black px-4 py-2 rounded-lg hover:bg-blue-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-colors duration-200"
            >
              Search
            </button>
            
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-5">
          {isLoading && (
            <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-60 bg-slate-200 dark:bg-slate-700 opacity-70">
              <ClipLoader size={80} color={dark ? "#ffffff" : "#000000"} />
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0">
              <p className="text-black dark:text-white text-xl">Error: {error.message}</p>
            </div>
          )}

          {data && data.items && data.items.length > 0 ? (
            data.items.map((user) => (
              <li
                key={user.id}
                className="bg-red-200 mb-4 flex p-4 rounded-lg w-full max-w-xs mx-auto border border-orange-100"
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
                <div>
                  <button onClick={() => handleProfileModel(user)}>Add more</button>
                </div>
              </li>
            ))
          ) : (
            <p className="mx-auto text-xl font-semibold text-black dark:text-white">
              No users found
            </p>
          )}
        </ul>

        {data && data.items && data.items.length > 0 ? (
          <div className="flex justify-between mt-5">
            <button
              disabled={page === 1}
              className="bg-blue-200 text-black px-3 py-2 rounded-sm hover:bg-blue-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-600 transition-colors duration-200"
              onClick={handlePrevious}
            >
              Previous
            </button>

            <span className="text-black dark:text-white font-semibold">
              Page {page} of {getTotalPages()}
            </span>

            <button
              disabled={page === getTotalPages()}
              className="bg-blue-200 text-black px-3 py-2 rounded-sm hover:bg-blue-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-600 transition-colors duration-200"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
      </main>

      <ProfileModel
        open={profileModel}
        data={userDetails}
        isLoading={userLoading}
        onCloseModel={handleCloseProfile}
      />
    </>
  );
};

export default App;
