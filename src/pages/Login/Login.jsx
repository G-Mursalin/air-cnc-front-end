import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import axios from "axios";
import GoogleAuth from "../../components/shared/SocialAuth/GoogleAuth";

const Login = () => {
  const { loading, setLoading, signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Login With Email Password
  const handleLogIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password)
      .then((result) => {
        toast.success("Login Successful");
        // Get JWT Token
        axios
          .post("http://localhost:5000/api/v1/users/jwt", {
            email: result.user.email,
          })
          .then((data) => {
            localStorage.setItem("access-token", data.data.accessToken);
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
        setLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Log In</h1>
          <p className="text-sm text-gray-400">
            Sign in to access your account
          </p>
        </div>
        <form
          noValidate=""
          action=""
          className="space-y-6 ng-untouched ng-pristine ng-valid"
          onSubmit={handleLogIn}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-rose-500 w-full rounded-md py-3 text-white"
            >
              {loading ? (
                <TbFidgetSpinner size={24} className="m-auto animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
        <div className="space-y-1">
          <button className="text-xs hover:underline hover:text-rose-500 text-gray-400">
            Forgot password?
          </button>
        </div>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
          <p className="px-3 text-sm dark:text-gray-400">
            Login with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
        </div>
        <GoogleAuth />
        <p className="px-6 text-sm text-center text-gray-400">
          Don't have an account yet?{" "}
          <Link
            to="/signup"
            className="hover:underline hover:text-rose-500 text-gray-600"
          >
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
