import Cookies from "js-cookie";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Navigate, Route, Routes } from "react-router-dom";
import SpinnerFullPage from "./Ui/SpinnerFullPage";

// Routes
const AppLayout = lazy(() => import("./pages/AppLayout"));
const BookContainer = lazy(() => import("./features/Book/BookContainer"));
const BookTable = lazy(() => import("./features/Book/BookTable"));
const AddBook = lazy(() => import("./features/Book/BookCrud"));
// users
const User_Container = lazy(() => import("./features/users/UserContainer"));
const User_List = lazy(() => import("./features/users/UserList"));
const User_Crud = lazy(() => import("./features/users/CrudUser"));

// page not found
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
// unAuth routes
const Login = lazy(() => import("./features/Auth/Login"));
// orders
const Order_Container = lazy(() => import("./features/Orders/OrderContainer"));
// profile
const Profile = lazy(() => import("./features/Profile/Profile"));
const App = () => {
  const { token } = useSelector((store) => store.auth);

  return (
    <Suspense fallback={<SpinnerFullPage />}>
      <Routes location={location} key={location.pathname}>
        {token?.length > 0 && token !== null ? (
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<User_Container />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<User_List />} />
              <Route path="add" element={<User_Crud />} />
              <Route path=":id/edit" element={<User_Crud />} />
            </Route>
            <Route path="book" element={<BookContainer />}>
              <Route index element={<Navigate to="all" replace />} />
              <Route path="all" element={<BookTable />} />
              <Route path="add" element={<AddBook />} />
              <Route path=":id/edit" element={<AddBook />} />
            </Route>
            {/* order */}
            <Route path="orders" element={<Order_Container />}></Route>
            {/* profiel */}
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        ) : (
          <Route path="/" element={<Login />} />
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
