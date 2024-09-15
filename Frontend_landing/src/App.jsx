import Cookies from "js-cookie";
import React, { Suspense, lazy, useEffect, useState } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
// Routes
const AppLayout = lazy(() => import("./pages/AppLayout"));
// page not found
const PageNotFound = lazy(() => import("./pages/PageNoutFound"));
// home
const Home = lazy(() => import("./pages/Home/Home"));
// auth
const Auth = lazy(() => import("./pages/Auth/Auth"));
const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Suspense>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          {/* login or register */}
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
