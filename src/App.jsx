import { Outlet } from "react-router-dom";
import DynamicTitle from "./components/DynamicTitle";

const App = () => {
  return (
    <>
      <DynamicTitle />
      <Outlet />
    </>
  );
};

export default App;
