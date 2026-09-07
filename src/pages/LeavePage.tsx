import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { APP_NAME } from "@/constants/app";
import "@/styles/meeting.css";

export default function Leave() {
  const { audioUploadAnimation } = useAppSelector((state) => state.nvReducer);

  return (
    <div className="meeting-shell flex justify-center items-center min-h-[100dvh] p-4">
      {audioUploadAnimation ? (
        <div className="landing-card p-8 text-center w-full max-w-md">
          <div
            className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: "var(--meeting-accent-soft)",
              borderTopColor: "var(--meeting-accent)",
            }}
          />
          <p className="landing-subtitle text-sm">Processing session...</p>
        </div>
      ) : (
        <div className="landing-card p-8 text-center w-full max-w-md">
          <h1 className="landing-title text-2xl font-semibold mb-2">
            Meeting ended
          </h1>
          <p className="landing-subtitle text-sm mb-6">
            Thanks for joining {APP_NAME}.
          </p>
          <Link to="/" className="landing-btn-primary inline-block py-2.5 px-6 no-underline">
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
