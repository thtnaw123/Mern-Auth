import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../features/authSlice";

const PrivateRoute = () => {
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default PrivateRoute;
