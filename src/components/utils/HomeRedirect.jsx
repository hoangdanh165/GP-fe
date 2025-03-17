import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import paths from "../../routes/paths";

const HomeRedirect = () => {
  const { auth } = useAuth();
  
  useEffect(() => {
    if (!auth?.role) {
      return;
    }
  }, [auth]);

  if (auth) {
    if (auth.role === "customer") {
      return <Navigate to={paths.accounts} />;
    } else if (auth.role === "admin") {
      return <Navigate to={paths.customer} />;
    } else if (auth.role === "sale") {
      return <Navigate to={paths.sale_contracts} />;
    } 
  }
  return <Navigate to="/auth/sign-in" replace/>;
};

export default HomeRedirect;
