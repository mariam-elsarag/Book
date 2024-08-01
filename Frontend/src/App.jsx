import Cookies from "js-cookie";
import React, { Suspense, lazy, useEffect, useState } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
// Routes
const AppLayout = lazy(() => import("./pages/AppLayout"));
const BookContainer = lazy(() => import("./pages/Book/BookContainer"));
const BookTable = lazy(() => import("./pages/Book/BookTable"));
const AddBook = lazy(() => import("./pages/Book/BookCrud"));

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Suspense>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="book" replace />} />
          <Route path="book" element={<BookContainer />}>
            <Route index element={<Navigate to="all" replace />} />
            <Route path="all" element={<BookTable />} />
            <Route path="add" element={<AddBook />} />
            <Route path=":id/edit" element={<AddBook />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
