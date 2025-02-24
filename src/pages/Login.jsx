import React, { useState, useContext ,use } from "react";
import { Input } from "../components/Input";
import { AuthContext  } from "../contexts/authContext";
import { useNavigate , Link } from "react-router-dom";
import Toast from "../components/Toast";

const Login = () => {
  const initialLoginState = {
    email: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  // Toast state to display success or error messages
  const [toast, setToast] = useState(null);
  const [loginObj, setLoginObj] = useState(initialLoginState);
  const navigate = useNavigate();
  
  const  context  = use(AuthContext);

const { login } = context;
  // Simple email validation using a regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    // Clear any previous toast messages
    setToast(null);

    if (!loginObj.email.trim()) {
      return setToast({ success: false, message: "Email is required!" });
    }
    if (!validateEmail(loginObj.email)) {
      return setToast({ success: false, message: "Please enter a valid email address!" });
    }
    if (!loginObj.password.trim()) {
      return setToast({ success: false, message: "Password is required!" });
    }

    setLoading(true);
    // Call the login function provided by AuthContext
    const response = await login(loginObj.email, loginObj.password);
    setLoading(false);

    if (response.success) {
      setToast({ success: true, message: response.message });
     
        navigate("/app/dashboard");
     
    } else {
      setToast({ success: false, message: response.message });
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    // Clear any existing toast when updating the form
    setToast(null);
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Manage your tasks efficiently with our Task Management App. <br />
            Track progress, set deadlines, and stay productive!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={submitForm}>
            <div className="form-control">
              <Input
                labelTitle="Email"
                type="email"
                updateType="email"
                placeholder="Enter your email"
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="form-control">
              <Input
                labelTitle="Password"
                type="password"
                updateType="password"
                placeholder="Enter your password"
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading-ring" : ""}`}
                disabled={loading}
              >
                Login
              </button>
            </div>
          </form>


          {/* Navigation link for registration */}
          <div className="text-center py-4">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register here
              </Link>
            </p>
          </div>

          {/* Render the Toast component if a message exists */}
          {toast && (
            <Toast
              success={toast.success}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
