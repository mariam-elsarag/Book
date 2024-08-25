import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi2";
import axios from "axios";
import Header from "../../Ui/Header";
import Table from "../../Ui/Table";
const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL;
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const colums = ["title", "author", "price"];
const BookTable = () => {
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      const response = await axios.delete(`${apiKey}/api/book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.status, "k");
      if (response.status === 204) {
        toast.success("Successfully delete book");
        getBooks(`${apiKey}/api/book/?page=1`);
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  // navigate
  const handleNavigate = (item) => {
    navigate(`/book/${item?._id}/edit`);
  };
  const actionList = [
    {
      id: 0,
      icon: <MdOutlineDelete size={20} color="#b50808" />,
      action: (item) => handleDelete(item._id),
    },
    {
      id: 1,
      icon: <FiEdit size={18} color="#1e3a8a" />,
      action: (item) => handleNavigate(item),
    },
  ];
  return (
    <div className="grid gap-8">
      <Header title="Book register" link={"/book/all"}>
        {location.pathname.includes("/book/all") && (
          <Link
            to={`/book/add`}
            className="border min-w-[150px] border-blue-900 hover:bg-blue-900 hover:text-white transition-all ease-in-out duration-300 text-blue-900 font-semibold rounded-[4px] text-sm  flex items-end justify-center w-fit py-2 px-5"
          >
            + ADD Book
          </Link>
        )}
      </Header>
      <Table
        columns={colums}
        data={data}
        noFields="grid-cols-[1fr_1fr_1fr_100px]"
        actionList={actionList}
      />

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
