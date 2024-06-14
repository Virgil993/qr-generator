import React from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../network/ApiAxios";

export default function Admin(props: { element: React.ReactNode }) {
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
  return <>{props.element}</>;
}
