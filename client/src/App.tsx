import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AllCodes from "./views/AllCodes";
import ViewCode from "./views/ViewCode";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path={`/all-codes`}
          element={<AllCodes />}
        />
        <Route
          path={`/view-code/:codeId`}
          element={<ViewCode />}
        />

        <Route path="*" element={<Navigate to="/all-codes" />} />
      </Routes>
    </Router>
  );
}
