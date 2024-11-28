import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { Signup } from "./signup";
import { PropTypes } from "prop-types";

export const LoginRoute = ({ setAuthenticated }) => {
  return (
    <Routes>
      <Route path="/*" exact element={<Navigate to="/login" />} />
      <Route
        path="/login"
        exact
        element={<Login setAuthenticated={setAuthenticated} />}
      />
      <Route
        path="/signup"
        element={<Signup setAuthenticated={setAuthenticated} />}
      />
    </Routes>
  );
};

LoginRoute.propTypes = {
  setAuthenticated: PropTypes.func,
};
