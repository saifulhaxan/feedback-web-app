// components/PublicRoute.js
import { Navigate } from "react-router-dom";
import useTokenStore from "../../store/userToken";
import useUserStore from "../../store/userStore";

export default function PublicRoute({ children }) {
  const token = useTokenStore((state) => state.tokens);
  const userData = useUserStore((state) => state.userData);

  // If token exists and profile is complete, redirect to /projects
  if (token && userData?.user?.isProfileComplete) {
    return <Navigate to="/projects" replace />;
  }

  return children;
}
