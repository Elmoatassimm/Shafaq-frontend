import React, { useState, use } from "react";
import { Input } from "../components/Input";
import { useNavigate,Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import Toast from "../components/Toast";

const Register = () => {
  const initialRegisterState = {
    username: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  };

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [registerObj, setRegisterObj] = useState(initialRegisterState);
  const navigate = useNavigate();

  const context = use(AuthContext);

  const { register } = context;

  const submitForm = async (e) => {
    e.preventDefault();
    // Clear any previous toast messages
    setToast(null);

    if (!registerObj.username.trim())
      return setToast({ success: false, message: "Username is required!" });
    if (!registerObj.emailId.trim())
      return setToast({ success: false, message: "Email is required!" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerObj.emailId))
      return setToast({
        success: false,
        message: "Please enter a valid email address!",
      });

    if (!registerObj.password.trim())
      return setToast({ success: false, message: "Password is required!" });
    if (registerObj.password !== registerObj.confirmPassword)
      return setToast({ success: false, message: "Passwords do not match!" });

    setLoading(true);

    // Call the register function from AuthContext
    const response = await register(
      registerObj.username,
      registerObj.emailId,
      registerObj.password,
      registerObj.confirmPassword
    );
    setLoading(false);

    if (response.success) {
      setToast({ success: true, message: "Registration successful!" });
      // Redirect after a short delay so the user sees the success toast
      setTimeout(() => {
        navigate("/app/dashboard");
      }, 1500);
    } else {
      setToast({
        success: false,
        message: response.message || "Registration failed",
      });
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    // Clear any existing toast when updating the form
    setToast(null);
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register Now!</h1>
          <p className="py-6">
            Create your account and start managing your tasks efficiently.
            <br />
            Track progress, set deadlines, and stay productive!
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={submitForm}>
            <div className="form-control">
              <Input
                labelTitle="Username"
                type="text"
                updateType="username"
                placeholder="Enter your username"
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="form-control">
              <Input
                labelTitle="Email"
                type="email"
                updateType="emailId"
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
            <div className="form-control">
              <Input
                labelTitle="Confirm Password"
                type="password"
                updateType="confirmPassword"
                placeholder="Confirm your password"
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading-ring" : ""}`}
                disabled={loading}
              >
                Register
              </button>
            </div>
          </form>

          {/* Navigation link for login */}
          <div className="text-center py-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Login here
              </Link>
            </p>
          </div>

          {/* Render the Toast component if a toast message exists */}
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

export default Register;
