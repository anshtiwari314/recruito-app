import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants/app";
import "@/styles/meeting.css";

const NotFound = () => {
  return (
    <div className="meeting-shell flex items-center justify-center min-h-screen p-4">
      <div className="landing-card text-center p-8 w-full max-w-md">
        <p className="text-6xl font-bold landing-link mb-2">404</p>
        <h1 className="landing-title text-xl font-semibold mb-2">
          Page not found
        </h1>
        <p className="landing-subtitle text-sm mb-6">
          This room or page does not exist in {APP_NAME}.
        </p>
        <Link
          to="/"
          className="landing-btn-primary inline-block py-2.5 px-6 no-underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
