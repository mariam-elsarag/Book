import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import SpinnerFullPage from "../../components/SpinnerFullPage";
const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL;

const BookCrud = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  // in edit page get book
  const getBook = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingBook(true);
      const response = await axios.get(`${apiKey}/api/book/${id}`, {
        signal,
      });
      const fetchedData = await response.data.book;
      setData(fetchedData);
      console.log(response.data, "kk");
    } catch (error) {
      console.error("Error fetching data:", error);

      setError(error);
    } finally {
      setLoadingBook(false);
    }
  };
  useEffect(() => {
    if (location.pathname.includes("edit")) {
      getBook();
    }
  }, []);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // for error
    if (value === "") {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "This Field is required",
        },
      }));
    } else {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  const handleErrors = () => {
    let hasErrors = false;

    if (data?.title === "" || !data?.title) {
      setError((prev) => ({
        ...prev,
        title: {
          message: "This field is required",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        title: {
          message: "",
        },
      }));
    }

    if (data?.author === "" || !data?.author) {
      setError((prev) => ({
        ...prev,
        author: {
          message: "This field is required",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        author: {
          message: "",
        },
      }));
    }
    if (data?.price === "" || !data?.price) {
      setError((prev) => ({
        ...prev,
        price: {
          message: "This field is required",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        price: {
          message: "",
        },
      }));
    }
    if (data?.published_year === "" || !data?.published_year) {
      setError((prev) => ({
        ...prev,
        published_year: {
          message: "This field is required",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        published_year: {
          message: "",
        },
      }));
    }

    return hasErrors;
  };

  const handleSubmit = async () => {
    const hasErrors = handleErrors();
    if (!hasErrors) {
      try {
        setLoading(true);
        const response = await axios.post(`${apiKey}/api/book/`, data);

        if (response.status === 201) {
          setData();
        }
      } catch (err) {
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    }
  };
  // for update data
  const updateData = async () => {
    const hasErrors = handleErrors();

    if (!hasErrors) {
      try {
        setLoading(true);
        const response = await axios.patch(`${apiKey}/api/book/${id}`, data);

        if (response.status === 200) {
          setData(response.data.book);
        }
      } catch (err) {
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    }
  };
  if (loadingBook) return <SpinnerFullPage />;
  return (
    <div className="grid gap-8">
      <header className="flex items-center gap-2 justify-between">
        <Link
          to={"/book/all"}
          className="text-blue-900  font-bold text-lg md:text-2xl  capitalize"
        >
          {location.pathname.includes("edit") ? "Edit Book" : "Add New Book"}
        </Link>
      </header>
      <div className="grid gap-4">
        <Input
          id="title"
          label="Title"
          value={data?.title || ""}
          type="text"
          placeholder="Enter book title"
          handleChange={handleChange}
          error={error?.title?.message}
        />
        <Input
          id="author"
          label="Author"
          value={data?.author || ""}
          type="text"
          placeholder="Enter book author"
          handleChange={handleChange}
          error={error?.author?.message}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  items-start">
          <Input
            id="published_year"
            label="Published Year"
            type="number"
            value={data?.published_year || ""}
            placeholder="Enter book Published Year"
            handleChange={handleChange}
            error={error?.published_year?.message}
          />
          <Input
            id="price"
            label="Price"
            type="number"
            value={data?.price || ""}
            placeholder="Enter book Price"
            handleChange={handleChange}
            error={error?.price?.message}
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <Link
            to="/book/all"
            className="border border-blue-900 px-4 h-[38px] flex items-center justify-center text-blue-900 rounded-[4px] capitalize text-sm transition-all ease-in-out duration-300 hover:bg-blue-900 hover:text-white "
          >
            view all
          </Link>
          <button
            disabled={loading}
            onClick={
              location.pathname.includes("edit") ? updateData : handleSubmit
            }
            className=" disabled:bg-white disabled:text-gray-400 disabled:shadow-sm disabled:border-gray-400 flex items-center gap-2 outline-none shadow-none bg-blue-900 text-white text-sm border border-blue-900 hover:bg-white hover:text-blue-900 hover:border-blue-900 transition-all duration-300 ease-in-out px-4 h-[38px] rounded-[4px]"
          >
            Submit
            {loading && <Spinner className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCrud;
