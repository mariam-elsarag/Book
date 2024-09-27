import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Spinner from "../Ui/Spinner";
import axiosInstance from "./../axiosInstance";
const Search = ({ apiLink, setData, setNext, setPrev, searchPlaceholder }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    try {
      setLoading(true);
      const Endpoint =
        search === "" ? `${apiLink}` : `${apiLink}&keywords=${search}`;
      const response = await axiosInstance.get(Endpoint);
      if (response.status === 200) {
        setData(response.data.results);
        setNext(response.data.next);
        setPrev(response.data.prev);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`flex-1 border border-dark-grey rounded-lg flex items-center gap-2 px-2`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <span role="button" onClick={handleSearch}>
          <IoSearchOutline />
        </span>
      )}
      <input
        className="w-full placeholder:text-light-gray text-natural-dark border-none focus:outline-none focus:shadow-none  bg-transparent py-2"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        disabled={loading}
      />
    </div>
  );
};

export default Search;
