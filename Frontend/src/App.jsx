import Cookies from "js-cookie";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router-dom";
// Routes
const AppLayout = lazy(() => import("./pages/AppLayout"));
const BookContainer = lazy(() => import("./features/Book/BookContainer"));
const BookTable = lazy(() => import("./features/Book/BookTable"));
const AddBook = lazy(() => import("./features/Book/BookCrud"));
// unAuth routes
const Login = lazy(() => import("./features/Auth/Login"));

const App = () => {
  const { token } = useSelector((store) => store.auth);

  return (
    <Suspense>
      <Routes location={location} key={location.pathname}>
        {token?.length > 0 && token !== null ? (
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="book" replace />} />
            <Route path="book" element={<BookContainer />}>
              <Route index element={<Navigate to="all" replace />} />
              <Route path="all" element={<BookTable />} />
              <Route path="add" element={<AddBook />} />
              <Route path=":id/edit" element={<AddBook />} />
            </Route>
          </Route>
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </Suspense>
  );
};

export default App;
