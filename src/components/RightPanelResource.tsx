import React from "react";
import { useAppSelector } from "@/store/store";

export function RightPanelResource() {
  const { jobDescription, interviewGuide, jobTitle } = useAppSelector(
    (state) => state.cuesReducer
  );

  console.log("trying here",jobDescription, interviewGuide, jobTitle);
  return (
    <>
      <div className="p-3 bg-neutral-50 rounded-lg" >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <i className="fa-regular fa-file-lines mr-2 text-neutral-600"></i>
              <div className="text-sm font-medium text-neutral-900">
              Knowledge Base 
              </div>
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              {/* {jobTitle} Position Details */}
              {/* Traya Health Position Details */}
              Ecommerce-Manager Position Details
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
            <a
              href={jobDescription}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              <i className="fa-solid fa-download"></i>
            </a>
          </button>
        </div>
      </div>
      <div className="p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <i className="fa-regular fa-clipboard mr-2 text-neutral-600"></i>
              <div className="text-sm font-medium text-neutral-900">
              Technical Guide
              </div>
            </div>
            <div className="text-sm text-neutral-600 mt-1">
              Assessment Framework
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <a
              href={interviewGuide}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
            <i className="fa-solid fa-download"></i>
            </a>
          </button>
        </div>
      </div>
    </>
  );
}

