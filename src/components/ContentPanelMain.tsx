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
      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 w-[95%]"
      style={{ backgroundColor: "#f2f2f2" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
            {/* {isAnswered ? (
            <i className="fa-solid fa-circle-check text-neutral-600"></i>
          ) : (
            <i className="fa-regular fa-circle text-neutral-600"></i>
          )} */}
          <span className="text-neutral-900">{parse(question?.similarity_query)}</span>
        </div>
        {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null}
      </div>
      {!isAnswered ? (
        <div className="ml-8"></div>
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
            <p className="mt-2 pl-2 pr-2">{parse(question?.content)}</p>
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
      className="bg-neutral-50 rounded-lg border border-neutral-200 mx-3 my-5 w-full transition-all duration-300 ease-in-out cursor-pointer"
      onClick={handleTopicClick}
      style={{
        height: isExpanded ? "auto" : "80px", 
        minHeight: "60px",
        //border:'0.2rem solid tomato'
      }}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {selectedTopic === topic.topic ? (
            <i className="fa-solid fa-circle-check text-neutral-600 flex-shrink-0"></i>
          ) : (
            <i className="fa-regular fa-circle text-neutral-600 flex-shrink-0"></i>
          )}
          <span className="text-neutral-900 font-bold capitalize truncate">{parse(topic?.topic)}</span>

          {/* Show spinner when loading, this topic is selected, and box is closed */}
          {isLoading && !isExpanded && <FaSpinner className="w-4 h-4 text-blue-500 animate-spin ml-2" />}
            {/* {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null} */}
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
        <button
          className="expand-button p-1 hover:bg-neutral-200 rounded transition-colors duration-200 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
            if (!isExpanded) {
              setIsLoading(false) // Stop loading when expanded
            }
          }}
        >
          {isExpanded ? (
            <FaChevronUp className="w-4 h-4 text-neutral-600" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-neutral-600" />
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
      className="px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200 mx-3 my-5 w-full transition-all duration-300 ease-in-out cursor-pointer"
      onClick={() => {
        dispatch(updateSelectedTopic(topic.topic));
      }}
      style={{
        height: isExpanded ? "auto" : "80px",
        minHeight: "60px",
        //border:'0.2rem solid blue'
      }}
    >
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center space-x-3">
          {selectedTopic === topic.topic ? (
            <i className="fa-solid fa-circle-check text-neutral-600"></i>
          ) : (
            <i className="fa-regular fa-circle text-neutral-600"></i>
          )}

          <span className="text-neutral-900" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            {parse(topic?.topic)}
          </span>
          {isLoading && <FaSpinner className="w-4 h-4 text-blue-500 animate-spin ml-2" />}
        </div>
        <button
          className="expand-button p-1 hover:bg-neutral-200 rounded transition-colors duration-200 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              setIsLoading(false); // Stop loading when expanded
            }
          }}
        >
          {isExpanded ? (
            <FaChevronUp className="w-4 h-4 text-neutral-600" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-neutral-600" />
          )}
        </button>
        {/* {isAnswered ? (
          <span className="px-2 py-1 bg-neutral-200 rounded text-sm">
            {question?.match_score ? `${question.match_score} match` : ""}
          </span>
        ) : null} */}
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
    <div className={`${!isExpanded ? "flex justify-between" : "flex flex-col"}`} style={{ flex: 0.75, height: "75%" }}>
      
      {/* <div
        id="transcription"
        style={{ overflowY: "hidden", height: "60vh", padding: "0 0.8rem" }}
        className={`${!isExpanded ? "flex-grow-0 flex-shrink-0 w-1/4 min-h-96 max-h-lvh mr-6" : "max-h-96 w-full"} mb-6 bg-white rounded-lg shadow-sm border-2 border-zinc-500 `}
      >
        <div className="flex items-center justify-between mb-4" style={{ height: "10%" }}>
          <h2 className="text-lg font-semibold text-neutral-900">Live Transcription</h2>
          <button className="text-sm text-neutral-600 hover:text-neutral-700" onClick={toggleExpand}>
            <i className={`fa-solid fa-${isExpanded ? "compress" : "expand"} mr-1`}></i>
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        <div className="space-y-8 flex-1" style={{ overflowY: "scroll", height: "85%" }} ref={transcriptionRef}>
          {transcriptions.map((transcription, i) => (
            <SingleTranscription data={transcription} key={i} />
          ))}
        </div>
      </div> */}

      <div
        id="ai-suggestions"
        style={{ overflowY: "hidden", height: "60vh", padding: "0 0.8rem", paddingBottom: "5rem" }}
        className={`${!isExpanded ? "flex-grow-0 w-full min-h-96 max-h-lvh" : "w-full max-h-96"} mb-6 bg-white rounded-lg shadow-sm border-2 border-zinc-500 overflow-y-auto`}
        ref={fullscreenElement}
      >
        <div className="flex items-center justify-between mb-4" style={{ height: "10%" }}>
          <h3 className="text-lg font-semibold text-neutral-900">AI Suggestions</h3>
          <button
            className="text-sm text-neutral-600 hover:text-neutral-700"
            onClick={isFullscreen ? exitFullscreen : goFullscreen}
          >
            <i className={`fa-solid fa-${isFullscreen ? "compress" : "expand"} mr-1`}></i>
            {isFullscreen ? "Collapse" : "Expand to full screen"}
          </button>
        </div>

        <div
          className="space-y-3 py-2 w-full"
          style={{
            overflowY: "scroll",
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
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
