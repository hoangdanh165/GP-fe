import { Navigate } from "react-router-dom";

const IsSignedIn = ({ children }) => {
    const isLoggedIn = localStorage.getItem("IsSignedIn") === "true";

    if (IsSignedIn) {
        return <Navigate to={"/"} replace />;
    }

    return children;
}

export default IsSignedIn;
