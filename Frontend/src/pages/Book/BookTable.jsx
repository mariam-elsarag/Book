import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi2";
import axios from "axios";
const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL;
const BookTable = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(`${apiKey}/api/book/?page=1`);
  const [previous, setpreviouse] = useState(null);

  const getBooks = async (endpoint) => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (next || previous) {
      try {
        setLoading(true);
        const Endpoint = endpoint ? endpoint : next;
        const response = await axios.get(Endpoint, {
          signal,
        });
        const fetchedData = await response.data.results;

        setData(fetchedData);

        setNext(response.data.next);
        setpreviouse(response.data.prev);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getBooks(`${apiKey}/api/book/?page=1`);
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${apiKey}/api/book/${id}`);

      if (response.status === 204) {
        getBooks();
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className="grid gap-8">
      <header className="flex items-center gap-2 justify-between">
        <Link
          to={"/book/all"}
          className="text-blue-900  font-bold text-lg md:text-2xl  capitalize"
        >
          Book register
        </Link>
        {location.pathname.includes("/book/all") && (
          <Link
            to={`/book/add`}
            className="border border-blue-900 hover:bg-blue-900 hover:text-white transition-all ease-in-out duration-300 text-blue-900 font-semibold rounded-[4px] text-sm  flex items-end justify-center w-fit py-2 px-5"
          >
            + ADD
          </Link>
        )}
      </header>
      <div className="w-full">
        <header className="grid grid-cols-[1fr_1fr_1fr_100px] py-3 bg-neutral-50 rounded-t-[4px] ">
          <div className="  text-neutral-700 ">Title</div>
          <div className=" text-center text-neutral-700">Author</div>
          <div className=" text-center text-neutral-700">Price</div>
          <div className="  "></div>
        </header>
        {/* body */}
        <div className="w-full">
          {data?.map((item, index) => (
            <ul
              className={`grid py-3 ${
                data?.length - 1 !== index ? "border-b border-neutral-300" : ""
              } grid-cols-[1fr_1fr_1fr_100px]`}
              key={item?._id}
            >
              <li className=" text-xs text-neutral-700">{item?.title}</li>
              <li className="text-center text-xs text-neutral-700">
                {item?.author}
              </li>
              <li className="text-center text-xs text-neutral-700">
                {item?.price}
              </li>
              <li className="flex items-center justify-center gap-2">
                <span
                  onClick={() => {
                    handleDelete(item?._id);
                  }}
                >
                  <MdOutlineDelete size={20} color="#b50808" />
                </span>
                <Link to={`/book/${item?._id}/edit`}>
                  <FiEdit size={18} color="#1e3a8a" />
                </Link>
              </li>
            </ul>
          ))}
        </div>
      </div>
      {/* pagination */}
      {(next || previous) && (
        <div className="flex items-center gap-5 justify-center ">
          <span
            onClick={() => {
              if (previous) {
                getBooks(previous);
              }
            }}
            className={` border  ${
              previous
                ? "border-blue-900 cursor-pointer"
                : "cursor-default border-neutral-200"
            } flex items-center justify-center w-[30px] h-[30px]  rounded-[4px] `}
          >
            <HiOutlineChevronLeft color={!previous ? "#d2c9c9" : "#1e3a8a"} />
          </span>
          <span
            onClick={() => {
              if (next) {
                getBooks(next);
              }
            }}
            className={` border  ${
              next
                ? "border-blue-900 cursor-pointer"
                : "border-neutral-200 cursor-default"
            } flex items-center justify-center w-[30px] h-[30px]  rounded-[4px] `}
          >
            <HiOutlineChevronRight color={!next ? "#d2c9c9" : "#1e3a8a"} />
          </span>
        </div>
      )}
    </div>
  );
};

export default BookTable;
