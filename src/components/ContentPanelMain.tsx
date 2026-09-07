import React from 'react'
import { useData } from "@/context/DataWrapper";
import { useAppSelector } from "@/store/store"
import { v4 as uuidv4 } from "uuid";
import type { CuesDataType } from "@/reducers/cuesReducer"
import { useEffect, useRef, useState } from "react"
import type { TranscriptionDataType } from "@/reducers/transcriptionReducer"
import parse from "html-react-parser"
import { useDispatch } from "react-redux"
import { updateSelectedTopic } from "@/reducers/cuesReducer"
import { FaChevronDown, FaChevronUp, FaSpinner } from "react-icons/fa"
import DraggableChatWindow from './DraggableChatWindow';
import ResizableDiv from './ResizableDiv';
import DraggableResizableBox from './DeepSeekResizableDiv';

export function SingleCue({
  question,
  isAnswered,
}: {
  question: CuesDataType
  isAnswered: boolean
}) {
  return (
    <div
      className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50 w-[95%]"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="text-slate-200 text-sm">{parse(question?.similarity_query)}</span>
        </div>
        {isAnswered ? (
          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null}
      </div>
      {!isAnswered ? (
        <div className="ml-8"></div>
      ) : (
        <div className="ml-4 text-sm text-slate-400">
          <div>
            <p className="mt-2 pl-2 pr-2 leading-relaxed">{parse(question?.content)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ClickableTopic({ topic, selectedTopic, isAnswered = false }) {
  const dispatch = useDispatch()
  //const [selectedTopic] = useAppSelector(state=>[state.cuesReducer.selectedTopic])
  // console.log(typeof dispatch(updateSelectedTopic('hellow')))
  const cuesList = topic.CuesList
  const [isExpanded, setIsExpanded] = useState(false) 
  const [isLoading, setIsLoading] = useState(false)
  const [prevCuesList, setPrevCuesList] = useState(cuesList || [])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (
      isMounted && 
      selectedTopic === topic.topic && 
      cuesList &&
      cuesList[0] && 
      !isExpanded 
    ) {
      // Check ONLY if cuesList[0].content has changed
      const prevFirstContent = prevCuesList[0]?.content
      const currentFirstContent = cuesList[0].content

      if (prevFirstContent && currentFirstContent && prevFirstContent !== currentFirstContent) {
        setIsLoading(true)
        const timer = setTimeout(() => {
          setIsLoading(false)
        }, 5000) 

        return () => clearTimeout(timer)
      }
    }
    setPrevCuesList(cuesList || [])
  }, [cuesList, isExpanded, selectedTopic, topic.topic, isMounted, prevCuesList])

  const handleTopicClick = (e) => {
    if (!e.target.closest(".expand-button")) {
      dispatch(updateSelectedTopic(topic.topic))
    }
  }

  return (
    <div
      className="rounded-xl border border-slate-700/50 bg-slate-800/40 mx-1 my-3 w-full transition-all duration-300 ease-in-out cursor-pointer hover:border-indigo-500/30"
      onClick={handleTopicClick}
      style={{
        height: isExpanded ? "auto" : "72px",
        minHeight: "60px",
      }}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {selectedTopic === topic.topic ? (
            <i className="fa-solid fa-circle-check text-indigo-400 flex-shrink-0"></i>
          ) : (
            <i className="fa-regular fa-circle text-slate-500 flex-shrink-0"></i>
          )}
          <span className="text-slate-200 font-semibold capitalize truncate text-sm">{parse(topic?.topic)}</span>

          {isLoading && !isExpanded && <FaSpinner className="w-4 h-4 text-indigo-400 animate-spin ml-2" />}
        </div>
        <button
          className="expand-button p-1.5 hover:bg-slate-700/60 rounded-lg transition-colors duration-200 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
            if (!isExpanded) {
              setIsLoading(false)
            }
          }}
        >
          {isExpanded ? (
            <FaChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[75vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-3">
          <div className="space-y-3 mx-0 w-full" style={{ overflowY: "auto", maxHeight: "70vh", minHeight: "200px" }}>
            {cuesList &&
              cuesList.map((question: CuesDataType, index: number) => (
                <SingleCue question={question} key={index} isAnswered={question.isanswered} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function QnaTopic({ topic, selectedTopic, isAnswered = false }) {
  const dispatch = useDispatch();
  //const [selectedTopic] = useAppSelector(state=>[state.cuesReducer.selectedTopic])
  // console.log(typeof dispatch(updateSelectedTopic('hellow')))
  const cuesList = topic.CuesList;

  const QnaRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true); // initially expanded
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prevCuesList, setPrevCuesList] = useState(cuesList || []);
  //  console.log(cuesList);
  useEffect(() => {
    if (QnaRef.current) {
      console.log('transcriptions inside content panel is changed')
      QnaRef.current.scrollTop = 0;
    }
  }, [cuesList]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
useEffect(() => {
  if (
    isMounted &&
    selectedTopic === topic.topic &&
    !isExpanded && // only when collapsed
    prevCuesList.length !== cuesList.length
  ) {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }

  // Delay update of prevCuesList slightly to avoid race condition
  setTimeout(() => {
    setPrevCuesList(cuesList || []);
  }, 10);
}, [cuesList, isExpanded, selectedTopic, topic.topic, isMounted, prevCuesList.length]);


  return (
    <div
      className="px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/40 mx-1 my-3 w-full transition-all duration-300 ease-in-out cursor-pointer hover:border-indigo-500/30"
      onClick={() => {
        dispatch(updateSelectedTopic(topic.topic));
      }}
      style={{
        height: isExpanded ? "auto" : "72px",
        minHeight: "60px",
      }}
    >
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center space-x-3">
          {selectedTopic === topic.topic ? (
            <i className="fa-solid fa-circle-check text-indigo-400"></i>
          ) : (
            <i className="fa-regular fa-circle text-slate-500"></i>
          )}

          <span className="text-slate-200 capitalize font-semibold text-sm">
            {parse(topic?.topic)}
          </span>
          {isLoading && <FaSpinner className="w-4 h-4 text-indigo-400 animate-spin ml-2" />}
        </div>
        <button
          className="expand-button p-1.5 hover:bg-slate-700/60 rounded-lg transition-colors duration-200 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              setIsLoading(false);
            }
          }}
        >
          {isExpanded ? (
            <FaChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
      {/*       
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
          </button> 

          <div>
            {toggleDetails && (
              <p className="mt-2 pl-2 pr-2" >
                {parse(question?.content)}
              </p>
            )}
          </div>
        </div>
      )} */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[75vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="space-y-3 mx-0 w-full"
          style={{
            overflowY: 'scroll',
            height: '35vh',
            // border: '0.1rem solid red'
          }}
          ref={QnaRef}
        >
          {/* Details of each suggestion to be fetched from API server ; for loop */}
          {cuesList &&
            cuesList.map((question: CuesDataType, index: number) => (
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
          <span className="text-neutral-950 break-all">{data?.speaker}</span>
          <span className="text-sm text-neutral-500">{data?.timeStamp}</span>
        </div>
        <p className="text-neutral-700 text-sm">{data?.transcription}</p>
      </div>
    </div>
  )
}

export default function ContentPanelMain() {
  const [cuesState, transcriptions] = useAppSelector((state) => [
    state.cuesReducer,
    state.trcpReducer.TranscriptionList,
     //state.cuesReducer.topics
  ])

  const [isExpanded, setIsExpanded] = useState(false)
  const fullscreenElement = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const transcriptionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight
    }
  }, [transcriptions])

  const goFullscreen = () => {
    const element = fullscreenElement.current
    setIsFullscreen(true)
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  return (
    <div className={`${!isExpanded ? "flex justify-between" : "flex flex-col"} h-full min-h-0`}>
      <div
        id="ai-suggestions"
        className={`${!isExpanded ? "flex-grow-0 w-full" : "w-full"} flex flex-col flex-1 min-h-0 meeting-panel overflow-hidden`}
        ref={fullscreenElement}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">AI Suggestions</h3>
            <p className="text-xs text-slate-500">Real-time coaching cues</p>
          </div>
          <button
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60 transition-colors"
            onClick={isFullscreen ? exitFullscreen : goFullscreen}
          >
            <i className={`fa-solid fa-${isFullscreen ? "compress" : "expand"} mr-1.5`}></i>
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>

        <div
          className="flex-1 min-h-0 overflow-y-auto meeting-scroll p-3 space-y-2"
        >
          {cuesState &&
            cuesState.topics.map((topic: CuesDataType, index: number) => {
              if (index !== cuesState.topics.length - 1)
                return (
                  <ClickableTopic
                    topic={topic}
                    selectedTopic={cuesState.selectedTopic}
                    key={index}
                    isAnswered={false}
                  />
                )
            })}

          {cuesState.topics.length > 0 && (
            <QnaTopic
              topic={cuesState.topics[cuesState.topics.length - 1]}
              selectedTopic={cuesState.selectedTopic}
              key={2399}
              isAnswered={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
