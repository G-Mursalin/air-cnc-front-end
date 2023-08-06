import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/NavBar/NavBar";

const Main = () => {
  return (
    <main>
      <NavBar />
      <div className="pt-28 pb-20">
        <Outlet />
      </div>
    </main>
  );
};

export default Main;
