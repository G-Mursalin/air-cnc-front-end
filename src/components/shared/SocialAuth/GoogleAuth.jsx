import axios from "axios";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const { setLoading, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Login With Google
  const handleGoogle = () => {
    signInWithGoogle()
      .then((result) => {
        // Save user to database
        axios
          .post("http://localhost:5000/api/v1/users", {
            email: result.user.email,
          })
          .then((data) => {
            // Get JWT Token
            axios
              .post("http://localhost:5000/api/v1/users/jwt", {
                email: result.user.email,
              })
              .then((data) => {
                console.log(data.data.accessToken);
                localStorage.setItem("access-token", data.data.accessToken);
                toast.success("Login Successful");
                navigate(from, { replace: true });
              })
              .catch((err) => {
                // Catch Errors for Get JWT Token
                const errorData = err.response.data;
                if (errorData.status === "fail") {
                  toast.error(errorData.message);
                } else if (errorData.status === "error") {
                  toast.error(errorData.message);
                } else {
                  toast.error(err.message);
                }
                setLoading(false);
                navigate("/");
              });
          })
          .catch((err) => {
            // Catch Errors for Save user to database
            const errorData = err.response.data;
            if (errorData.status === "fail") {
              toast.error(errorData.message);
            } else if (errorData.status === "error") {
              toast.error(errorData.message);
            } else {
              toast.error(err.message);
            }
            setLoading(false);
            navigate("/");
          });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <div
      onClick={handleGoogle}
      className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer"
    >
      <FcGoogle size={32} />
      <p>Continue with Google</p>
    </div>
  );
};

export default GoogleAuth;
