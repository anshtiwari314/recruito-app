import { useData } from "@/context/DataWrapper";
import { useAppSelector } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import type { CuesDataType } from "@/reducers/cuesReducer";

export default function ContentPanelMain() {
  const currentCues = useAppSelector((state) => state.cuesReducer.CuesList);
  return (
    <>
      <div
        id="transcription"
        className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200"
        
      >
        {/* Header of transcription section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Live Transcription
          </h2>
          <button className="text-sm text-neutral-600 hover:text-neutral-700">
            <i className="fa-solid fa-expand mr-1"></i> Expand
          </button>
        </div>

        {/* Details of transcripts to be fetched from API server ; for loop */}
        <div className="space-y-4">
          <div className="flex space-x-3">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=INT"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <span className="font-medium text-neutral-900">
                  Interviewer
                </span>
                <span className="text-sm text-neutral-500 ml-2">08:31 PM</span>
              </div>
              <p className="text-neutral-700">
                Can you explain your experience with EDI integration projects?
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <span className="font-medium text-neutral-900">Varun</span>
                <span className="text-sm text-neutral-500 ml-2">08:32 PM</span>
              </div>
              <p className="text-neutral-700">
                I have worked on multiple EDI projects involving X12 and EDIFACT
                standards...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions section */}
      <div
        id="ai-suggestions"
        className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200"
        
      > 
        {/* AI Suggestions section header */}
        <h3 className="text-lg font-semibold mb-4 text-neutral-900">AI Suggestions</h3>
        <div className="space-y-3">
              {/* Details of each suggestion to be fetched from API server ; for loop */}
              {currentCues && currentCues.map((question:CuesDataType, index:number) => (
                <div
                  key={index}
                  className="p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <i className="fa-regular fa-circle text-neutral-600"></i>
                    <span className="text-neutral-900">{question.similarity_query}</span>
                  </div>
                  {/*<span className="px-2 py-1 bg-neutral-200 rounded text-sm">95% match</span>*/}
                </div>
                {/*
                <div className="ml-8 text-sm text-neutral-600">
                  <p>Question asked and answered satisfactorily</p>
                  <button className="mt-2 text-neutral-700 hover:text-neutral-900">
                    <i className="fa-solid fa-chevron-down mr-1"></i> View Details
                  </button>
                </div>
                */}
              </div>
              ))}
            </div>
          </div>
    </>
  );
}

