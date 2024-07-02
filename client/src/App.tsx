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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path={`/auth`} element={<Auth />}>
          <Route path={`/auth/login`} element={<Login />} />
          <Route path={`/auth/register`} element={<Register />} />
        </Route>
        <Route path={`/admin`} element={<Admin />}>
          <Route path={`/admin/all-codes`} element={<AllCodes />} />
          <Route path={`/admin/view-code/:id`} element={<ViewCode />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}
