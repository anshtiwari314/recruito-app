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

          <span className="text-neutral-900">{question?.similarity_query}</span>
        </div>
        {/* {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null} */}
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
  }, [transcriptions]); // Runs when transcriptions update

  return (
    <div className={`${!isExpanded ? "flex justify-between" : "flex flex-col"}`} 
    style={{flex:0.75,maxHeight:'75%'}}
    
    >
      <div
        id="transcription"
        ref={transcriptionRef}
        style={{overflowY:'hidden',height:'100%',padding:'0 0.8rem'}}
        className={`${!isExpanded ? "flex-grow-0 flex-shrink-0 w-1/4 min-h-96 max-h-lvh mr-6" : "max-h-96 w-full"} mb-6 bg-white rounded-lg shadow-sm border-2 border-zinc-500 `}
      >
        {/* Header of transcription section */}
        <div className="flex items-center justify-between mb-4" style={{height:'10%'}}>
          <h2 className="text-lg font-semibold text-neutral-900">
            Live Transcription
          </h2>
          <button 
            className="text-sm text-neutral-600 hover:text-neutral-700"
            onClick={toggleExpand}
          >
            <i className={`fa-solid fa-${isExpanded ? "compress" : "expand"} mr-1`}></i>{isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        {/* Details of transcripts to be fetched from API server ; for loop */}
        <div className="space-y-8 flex-1" style={{overflowY:'scroll',height:'85%'}}>
          {transcriptions.map((transcription, i) => (
            <SingleTranscription data={transcription} key={i} />
          ))}

          {/* <div className="flex space-x-3">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="flex items-center">
                <span className="text-base font-bold text-neutral-900">Varun</span>
                <span className="text-sm text-neutral-500 ml-2">08:32 PM</span>
              </div>
              <p className="text-neutral-700 text-sm">
                I have worked on multiple EDI projects involving X12 and EDIFACT
                standards...
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* AI Suggestions section */}
      <div
        id="ai-suggestions"
        style={{overflowY:'hidden',height:'100%',padding:'0 0.8rem'}}
        className={`${!isExpanded ? "flex-grow-0 w-3/4 min-h-96 max-h-lvh" : "w-full max-h-96"} mb-6 bg-white rounded-lg shadow-sm border-2 border-zinc-500 overflow-y-auto`}
      >
        {/* AI Suggestions section header */}
        <div className="flex items-center justify-between mb-4" style={{height:'10%'}}>
        <h3 className="text-lg font-semibold text-neutral-900" >
          AI Suggestions
        </h3>
        </div>
        <div className="space-y-3" style={{overflowY:'scroll',height:'85%'}}>
          {/* Details of each suggestion to be fetched from API server ; for loop */}
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

