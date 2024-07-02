import React from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../network/ApiAxios";
import { Outlet } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem("apiToken") === null) {
      localStorage.clear();
      navigate("/auth/login");
      return;
    }
    async function checkUserAuth() {
      const res = await checkToken().catch((error) => {
        console.log("Error checking user auth", error);
        return null;
      });
      if (res?.status !== 200) {
        localStorage.clear();
        navigate("/auth/login");
      }
    }
    checkUserAuth();
  }, [navigate]);
  return (
    <>
      <Outlet />
    </>
  );
}
