import React, { useEffect, useState } from "react";
import Header from "../../Ui/Header";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../Ui/Table";
import { useSelector } from "react-redux";
import { apiKey } from "../../utils/helper";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { GoPlus } from "react-icons/go";
const columns = ["full_name", "email", "role"];
const headerColumns = ["full name", "email", "role"];

const UserList = () => {
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(`${apiKey}/api/admin/users/?page=1`);
  const [previous, setpreviouse] = useState(null);

  const getUsers = async (endpoint) => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (next || previous || endpoint) {
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
    getUsers(`${apiKey}/api/admin/users/?page=1`);
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${apiKey}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        getUsers(`${apiKey}/api/admin/users/?page=1`);
        toast.success("Successfully delete user");
      }
    } catch (err) {
      console.log("error", err);
    }
  };
  // navigate
  const handleNavigate = (item) => {
    navigate(`/users/${item?._id}/edit`);
  };
  const actionList = [
    {
      id: 0,
      icon: <MdOutlineDelete size={18} color="var(--natural-light)" />,
      action: (item) => handleDelete(item._id),
    },
    {
      id: 1,
      icon: <FiEdit size={18} color="var(--natural-light)" />,
      action: (item) => handleNavigate(item),
    },
  ];

  const renderColumn = {
    role: (value) => {
      return (
        <span
          className={`px-2 py-1 rounded text-primary-600 text-xs bg-primary-100`}
        >
          {value}
        </span>
      );
    },
  };
  return (
    <Table
      headerColumns={headerColumns}
      columns={columns}
      data={data}
      actionList={actionList}
      renderColumn={renderColumn}
      headerClassName="min-w-[150px]"
    />
  );
};

export default UserList;
