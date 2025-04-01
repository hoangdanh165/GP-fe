import { Navigate } from "react-router-dom";

const IsSignedIn = ({ children }) => {
  const isSignedIn = localStorage.getItem("isSignedIn") === "true";

  if (isSignedIn) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default IsSignedIn;
