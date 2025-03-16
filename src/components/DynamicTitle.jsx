import { useEffect } from "react";
import { useMatches } from "react-router-dom";

const titleMap = {
    "/": "Home",
    "/auth/sign-in": "Sign In",
    "/auth/sign-up": "Sign Up",
    "/admin": "Admin Dashboard",
    "/customer": "Customer",
    "/sale": "Sales Staff",
    "/unauthorized": "Unauthorized",
    "/forbidden": "Forbidden",
    "/banned": "Account Banned",
    "*": "Page Not Found",
  };
  

const DynamicTitle = () => {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || "/";

  useEffect(() => {
    document.title = titleMap[currentPath] || "Prestige Auto";
  }, [currentPath]);

  return null;
};

export default DynamicTitle;
