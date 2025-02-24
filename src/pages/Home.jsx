import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col mb-60">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-4">
        {/* Top Link */}
        <button className="btn btn-sm btn-ghost text-lg mb-16">
          Learn more →
        </button>

        {/* Main Content */}
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Manage Your Tasks Easily
          </h1>
          <p className="text-lg mb-10 opacity-90">
            Stay organized and get more done with our simple task management
            app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="btn btn-outline text-primary text-lg px-10"
            >
              Login
            </Link>
            <Link to="/register" className="btn btn-primary text-lg px-10">
              Get Started →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
