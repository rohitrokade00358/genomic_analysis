import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = sessionStorage.getItem("user-token");
    const category = sessionStorage.getItem("category");

    if (!userToken || userToken === "undefined" || !category) {
      setIsLoggedIn(false);
      return navigate("/login?returnUrl=" + props.returnUrl);
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedRoute;