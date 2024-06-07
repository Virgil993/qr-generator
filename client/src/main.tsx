import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthService } from "@genezio/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  ? import.meta.env.VITE_GOOGLE_CLIENT_ID
  : "";
const authToken = import.meta.env.VITE_AUTH_TOKEN
  ? import.meta.env.VITE_AUTH_TOKEN
  : "";
const authRegion = import.meta.env.VITE_AUTH_REGION
  ? import.meta.env.VITE_AUTH_REGION
  : "";
AuthService.getInstance().setTokenAndRegion(authToken, authRegion);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
