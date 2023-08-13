import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import HostModal from "../../Modal/HostRequestModal";
import { makeAUserHost } from "../../../api/auth";
import { toast } from "react-hot-toast";

const MenuDropdown = () => {
  const { user, logOut, isUserHost, setIsUserHost } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  // Handle Modal
  const modalHandler = (email) => {
    makeAUserHost(email)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          setIsUserHost("host");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    setModal(false);
  };

  // Close Modal
  const closeModal = () => {
    setModal(false);
  };
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden md:block text-sm font-semibold py-3 px-8 rounded-full  transition cursor-pointer">
          {!isUserHost && (
            <button
              onClick={() => {
                setModal(true);
              }}
              className="hover:bg-neutral-100 cursor-pointer py-3 px-4"
              disabled={!user}
            >
              AirCNC your home 123
            </button>
          )}
        </div>

        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            <Link
              to="/"
              className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Dashboard
                </Link>
                <div
                  onClick={() => {
                    logOut();
                    setIsUserHost(null);
                  }}
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer"
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <HostModal
        closeModal={closeModal}
        email={user?.email}
        modalHandler={modalHandler}
        isOpen={modal}
      />
    </div>
  );
};

export default MenuDropdown;
