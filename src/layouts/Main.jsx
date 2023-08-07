import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/NavBar/NavBar";
import Footer from "../components/shared/Footer/Footer";

const Main = () => {
  return (
    <main>
      <NavBar />
      <div className="pt-28 pb-20">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Main;
