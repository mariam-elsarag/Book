import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import SpinnerFullPage from "../../components/SpinnerFullPage";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL;

const BookCrud = () => {
  const { id } = useParams();
  const { token } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const {
    control,
    setError,
    reset,
    setValue,
    formState: { errors, isValid, dirtyFields },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      published_year: 0,
      price: 0,
    },
    mode: "onChange",
  });
  const all = watch();

  // in edit page get book
  const getBook = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoadingBook(true);
      const response = await axios.get(`${apiKey}/api/book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });
      const fetchedData = await response.data.book;
      setValue("title", fetchedData.title);
      setValue("author", fetchedData.author);
      setValue("published_year", fetchedData.published_year);
      setValue("price", fetchedData.price);
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

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiKey}/api/book/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        reset();
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  // for update data
  const updateData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${apiKey}/api/book/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Successully edit book data");
        setValue("title", response.data.book.title);
        setValue("author", response.data.book.author);
        setValue("published_year", response.data.book.published_year);
        setValue("price", response.data.book.price);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBook) return <SpinnerFullPage />;
  return (
    <div className="grid gap-8">
      <header className="flex items-center gap-2 justify-between">
        <Link
          to={"/book/all"}
          className="text-blue-900  font-bold text-lg md:text-2xl  capitalize "
        >
          {location.pathname.includes("edit") ? "Edit Book" : "Add New Book"}
        </Link>
      </header>
      <form
        onSubmit={handleSubmit(
          location.pathname.includes("edit") ? updateData : onSubmit
        )}
        className="grid gap-4"
      >
        <Controller
          name="title"
          rules={{ required: "Title is required" }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="title"
              label="Title"
              type="text"
              placeholder="Enter book title"
              error={errors?.title?.message}
              handleChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          name="author"
          rules={{ required: "Author is required" }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              id="author"
              label="Author"
              type="text"
              placeholder="Enter book author"
              error={errors?.author?.message}
              handleChange={field.onChange}
              value={field.value}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  items-start">
          <Controller
            name="published_year"
            rules={{ required: "Published year is required" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="published_year"
                type="number"
                label="Published Year"
                placeholder="Enter book Published Year"
                error={errors?.published_year?.message}
                handleChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <Controller
            name="price"
            rules={{ required: "Price is required" }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                id="price"
                label="Price"
                type="number"
                placeholder="Enter book Price"
                error={errors?.price?.message}
                handleChange={field.onChange}
                value={field.value}
              />
            )}
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
            type="submit"
            disabled={
              Object.keys(dirtyFields)?.length > 0 ? false : true || loading
            }
            className=" disabled:bg-white disabled:text-gray-400 disabled:shadow-sm disabled:border-gray-400 flex items-center gap-2 outline-none shadow-none bg-blue-900 text-white text-sm border border-blue-900 hover:bg-white hover:text-blue-900 hover:border-blue-900 transition-all duration-300 ease-in-out px-4 h-[38px] rounded-[4px]"
          >
            Submit
            {loading && <Spinner className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookCrud;
