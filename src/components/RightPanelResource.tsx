import React from "react";
import { useAppSelector } from "@/store/store";

export function RightPanelResource() {
  const { jobDescription, interviewGuide } = useAppSelector(
    (state) => state.cuesReducer
  );

  return (
    <>
      <div className="p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <i className="fa-regular fa-file-lines mr-2 text-neutral-600"></i>
              <div className="text-sm font-medium text-neutral-900">
                Job Description
              </div>
            </div>
            <div className="text-sm text-neutral-600 mt-1">
            <a 
              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
              download="dummy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            />
              EDI Developer Position Details
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>
      <div className="p-3 bg-neutral-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <i className="fa-regular fa-clipboard mr-2 text-neutral-600"></i>
              <div className="text-sm font-medium text-neutral-900">
                Interview Guide
              </div>
            </div>
            <div className="text-sm text-neutral-600 mt-1">
            <a 
              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
              download="dummy.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            />
            Technical Assessment Framework
            </div>
          </div>
          <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>
    </>
  );
}
