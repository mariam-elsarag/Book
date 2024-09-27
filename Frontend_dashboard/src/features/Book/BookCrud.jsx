import React, { useEffect, useState } from "react";
// lib
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

// component

import Crud from "../../components/Crud";
import useGetData from "./../../hooks/useGetData";
import { apiKey } from "../../utils/helper";

const BookCrud = () => {
  const { id } = useParams();
  const { token } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  // book genres
  const { data: genreList } = useGetData("/api/genre/");
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
  const list = [
    {
      id: 1,
      type: "input",
      fieldName: "title",
      label: "Title",
      inputType: "text",
      placeholder: "Enter book title",
      validator: {
        required: "Title is required",
      },
    },
    {
      id: 2,
      type: "input",
      fieldName: "author",
      label: "Author",
      inputType: "text",
      placeholder: "Enter author name",
      validator: {
        required: "Author name is required",
      },
    },
    {
      id: 3,
      type: "input",
      fieldName: "price",
      label: "Price",
      inputType: "number",
      placeholder: "Enter book price",
      validator: {
        required: "Price is required",
      },
    },
    {
      id: 4,
      type: "input",
      fieldName: "quantity",
      label: "Quantity",
      inputType: "number",
      placeholder: "Enter your quantity of bookd",
      validator: {
        required: "quantity is required",
      },
    },
    {
      id: 5,
      type: "input",
      fieldName: "published_year",
      label: "Published year",
      inputType: "number",
      placeholder: "Enter published year of the book",
      validator: {
        required: "published year is required",
      },
    },
    {
      id: 6,
      label: "Book Genre",
      type: "dropdown",
      fieldName: "genre",
      listData: genreList?.data?.map((item) => ({
        name: item?.title,
        value: item?._id,
      })),
      validator: {
        required: "Book genre  is required",
      },
      placeholder: "Select book genre ",
    },
    {
      id: 7,
      type: "textarea",
      fieldName: "description",
      label: "Description",
      inputType: "text",
      placeholder: "Enter description of the book",
      validator: {
        required: "Description is required",
      },
    },
    {
      id: 8,
      label: "Thumbnail",
      type: "file",
      fieldName: "thumbnail",
      validator: {
        required: "Book thumbnail is required",
      },
      placeholder: "Select your book thumbnail image ",
    },
  ];

  // in book data
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
      const fetchedData = await response.data;

      setValue("title", fetchedData.title);
      setValue("author", fetchedData.author);
      setValue("published_year", fetchedData.published_year);
      setValue("price", fetchedData.price);
      setValue("genre", fetchedData.genre._id);
      setValue("description", fetchedData.description);
      setValue("quantity", fetchedData.quantity);
      setValue("thumbnail", `${apiKey}${fetchedData.thumbnail}`);
    } catch (error) {
      console.error("Error fetching data:", error);

      setError(error);
    } finally {
      setLoadingBook(false);
    }
  };
  // handle submit book
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setIsSubmiting(true);
      const response = await axios.post(`${apiKey}/api/book/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // reset();
        console.log(response, "s");
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
      setIsSubmiting(false);
    }
  };

  // for update book
  const updateData = async (data) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${apiKey}/api/book/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Successully edit book data");
        navigate("/book/all");
        setValue("title", response.data.book.title);
        setValue("author", response.data.book.author);
        setValue("published_year", response.data.book.published_year);
        setValue("price", response.data.book.price);
        setValue("description", fetchedData.description);
        setValue("quantity", fetchedData.quantity);
        setValue("quantity", fetchedData.quantity);
        setValue("thumbnail", `${apiKey}${fetchedData.thumbnail}`);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Crud
        submitFunction={onSubmit}
        formList={list}
        updateFunction={updateData}
        getFunction={getBook}
        isSubmiting={isSubmiting}
        errors={errors}
        loading={loading}
        loadingGetData={loadingBook}
        handleSubmit={handleSubmit}
        control={control}
        dirtyFields={dirtyFields}
        allDataLink="/book/all"
      />
    </div>
  );
};

export default BookCrud;
