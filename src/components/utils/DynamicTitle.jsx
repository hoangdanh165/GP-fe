import { useEffect } from "react";
import { useMatches, useLocation } from "react-router-dom";

const titleMap = {
  "/": "Home",

  // Auth
  "/auth/sign-in/": "Sign In",
  "/auth/sign-up/": "Sign Up",

  // Admin
  "/admin": "Admin Dashboard",

  // Customer
  "/customer": "Customer",

  // Sale
  "/sale": "Sales Staff",

  
  // Error
  "/unauthorized/": "Unauthorized",
  "/forbidden/": "Forbidden",
  "/banned/": "Account Banned",
  "*": "Page Not Found",
};
  

const DynamicTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = titleMap[location.pathname] || "Prestige Auto";
  }, [location.pathname]);

  return null;
};

export default DynamicTitle;
