import React from 'react'
import { useData } from "@/context/DataWrapper";
import { useAppSelector } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import type { CuesDataType } from "@/reducers/cuesReducer";
import { useEffect, useRef, useState } from "react";
import type { TranscriptionDataType } from "@/reducers/transcriptionReducer";
import parse from 'html-react-parser';

export function SingleCue({
  question,
  isAnswered,
}: {
  question: CuesDataType;
  isAnswered: boolean;
}) {
  const [toggleDetails, setToggleDetails] = useState(true);

  return (
    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          {isAnswered ? (
            <i className="fa-solid fa-circle-check text-neutral-600"></i>
          ) : (
            <i className="fa-regular fa-circle text-neutral-600"></i>
          )}

          <span className="text-neutral-900">{parse(question?.similarity_query)}</span>
        </div>
        {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null}
      </div>
      {!isAnswered ? (
        <div className="ml-8">
        </div>
      ) : (
        <div className="ml-8 text-sm text-neutral-600">
          {/* <button
            className="mt-2 text-neutral-700 hover:text-neutral-900"
            onClick={() => setToggleDetails((p) => !p)}
          >
            {toggleDetails ? (
              <i className="fa-solid fa-chevron-down mr-1" />
            ) : (
              <i className="fa-solid fa-chevron-right mr-1" />
            )}
            View Details
          </button> */}
          <div>
            {toggleDetails && (
              <p className="mt-2 pl-2 pr-2" >
                {parse(question?.content)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SingleTranscription({ data }: { data: TranscriptionDataType }) {
  return (
    <div className="flex w-full flex-shrink-0">
      <img
        src={
          data.isCandidate
            ? "https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA"
            : "https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=INT"
        }
        className="w-8 h-8 rounded-full mr-3"
      />
      <div className="w-full flex flex-col">
        <div className="flex flex-wrap justify-between items-center break-all">
          <span className="text-neutral-950 break-all">
            {data?.speaker}
          </span>
          <span className="text-sm text-neutral-500">
            {data?.timeStamp}
          </span>
        </div>
        <p className="text-neutral-700 text-sm">{data?.transcription}</p>
      </div>
    </div>
  );
}

export default function ContentPanelMain() {
  const [currentCues, transcriptions] = useAppSelector((state) => [
    state.cuesReducer.CuesList,
    state.trcpReducer.TranscriptionList,
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const transcriptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [transcriptions]);

  return (
    <div
      className={`flex gap-6 mb-4 ${
        isExpanded ? "flex-col h-[60vh]" : "flex-row h-[60vh]"
      }`}
    >
    
      <div
        className={`flex flex-col bg-white rounded-lg shadow-sm border-2 border-zinc-500 ${
          isExpanded ? "h-[55%] w-full" : "w-[26%] h-full"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-300">
          <h2 className="text-lg font-semibold text-neutral-900">Live Transcription</h2>
          <button
            className="text-sm text-neutral-600 hover:text-neutral-700"
            onClick={toggleExpand}
          >
            <i className={`fa-solid fa-${isExpanded ? "compress" : "expand"} mr-1`}></i>
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
        <div
          ref={transcriptionRef}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-9"
        >
          {transcriptions.map((transcription, i) => (
            <SingleTranscription data={transcription} key={i} />
          ))}
        </div>
      </div>

    
      <div
        className={`flex flex-col bg-white rounded-lg shadow-sm border-2 border-zinc-500 ${
          isExpanded ? "h-[42%] w-full" : "w-[80%] h-full"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-300">
          <h3 className="text-lg font-semibold text-neutral-900">AI Suggestions</h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
          {currentCues &&
            currentCues.map((question: CuesDataType, index: number) => (
              <SingleCue
                question={question}
                key={index}
                isAnswered={question.isanswered}
              />
            ))}
        </div>
      </div>
    </div>
  );
}



