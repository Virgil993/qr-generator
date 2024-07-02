import React from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("apiToken") != null) {
      navigate("/admin/all-codes");
    }
  }, [navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}
