import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./views/Login";
import Register from "./views/Register";
import AllCodes from "./views/AllCodes";
import Auth from "./layouts/Auth";
import Admin from "./layouts/Admin";
import ViewCode from "./views/ViewCode";
import Guest from "./views/Guest";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={`/auth/login`} element={<Auth element={<Login />} />} />
        <Route
          path={`/auth/register`}
          element={<Auth element={<Register />} />}
        />
        <Route path={`/auth/guest`} element={<Auth element={<Guest />} />} />
        <Route
          path={`/admin/all-codes`}
          element={<Admin element={<AllCodes />} />}
        />
        <Route
          path={`/admin/view-code/:codeId`}
          element={<Admin element={<ViewCode />} />}
        />

        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}
