import React from 'react'
import RightPanel from '@/components/RightPanel'

export default function Comp(){
  return (
    <div id="app" className="min-h-screen bg-neutral-50">
  <header
    id="header"
    className="w-full bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between shadow-sm"
  >
    <div className="flex items-center space-x-4">
      <i className="fa-solid fa-arrow-left text-neutral-600"></i>
      <div className="h-8 w-[2px] bg-neutral-200"></div>
      <img
        src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo"
        className="h-8"
        alt="Logo"
      />
      <div className="text-sm text-neutral-500">Recruiter Copilot</div>
    </div>
    <div className="flex items-center space-x-4">
      <button className="flex items-center px-3 py-1.5 bg-neutral-50 rounded-full text-sm text-neutral-600">
        <i className="fa-solid fa-circle text-neutral-500 mr-2 text-xs"></i>
        Live
      </button>
      <i className="fa-solid fa-download text-neutral-600"></i>
      <i className="fa-solid fa-ellipsis-vertical text-neutral-600"></i>
    </div>
  </header>
  <main id="main-content" className="flex h-[calc(100vh-120px)]">
    <div id="content-panel" className="flex-grow p-6 overflow-y-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-neutral-900">
            Interview: EDI Developer Position
          </h1>
          <div className="flex items-center text-sm text-neutral-500">
            <i className="fa-regular fa-calendar mr-2"></i>
            <span>Friday, September 22, 2025</span>
            <span className="mx-2">•</span>
            <span>08:30 PM</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <i className="fa-regular fa-clock mr-1"></i> 32:45
            </span>
          </div>
        </div>
        <button className="px-4 py-2 bg-neutral-600 text-white rounded-lg text-sm font-medium hover:bg-neutral-700">
          End Interview
        </button>
      </div>
      <div
        id="transcription"
        className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Live Transcription
          </h2>
          <button className="text-sm text-neutral-600 hover:text-neutral-700">
            <i className="fa-solid fa-expand mr-1"></i> Expand
          </button>
        </div>
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
      <div
        id="ai-suggestions"
        className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-neutral-900">
              AI Suggestions
            </h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center text-neutral-700">
                <input
                  type="radio"
                  name="suggestions"
                  className="mr-2 text-neutral-600"
                />
                Strong understanding of EDI standards demonstrated
              </label>
              <label className="flex items-center text-neutral-700">
                <input
                  type="radio"
                  name="suggestions"
                  className="mr-2 text-neutral-600"
                />
                Experience with integration platforms verified
              </label>
              <label className="flex items-center text-neutral-700">
                <input
                  type="radio"
                  name="suggestions"
                  className="mr-2 text-neutral-600"
                />
                Follow up on cloud integration experience
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="ai-query" className="fixed bottom-20 left-6 right-[340px]">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-full text-sm mr-2">
              <i className="fa-solid fa-robot mr-2"></i>
              AI Assistant
            </div>
            <input
              type="text"
              placeholder="Ask follow-up questions or request analysis..."
              className="flex-grow p-2.5 bg-neutral-50 rounded-lg border-0 focus:ring-2 focus:ring-neutral-200"
            />
            <button className="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
              <i className="fa-solid fa-microphone"></i>
            </button>
            <button className="p-2.5 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <RightPanel/>
  </main>
  <div
    id="control-panel"
    className="fixed bottom-0 w-full bg-white border-t border-neutral-200 shadow-lg"
  >
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center space-x-2">
        <span className="flex items-center px-3 py-1.5 bg-neutral-50 rounded-full text-sm text-neutral-600">
          <i className="fa-solid fa-circle mr-2 text-xs"></i>
          32:45
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i className="fa-solid fa-table-cells"></i>
        </button>
        <button className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
          <i className="fa-solid fa-video"></i>
        </button>
        <button className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
          <i className="fa-solid fa-microphone"></i>
        </button>
        <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i className="fa-solid fa-message"></i>
        </button>
        <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i className="fa-solid fa-desktop"></i>
        </button>
        <div className="h-8 w-[2px] bg-neutral-200"></div>
        <button className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg flex items-center">
          <i className="fa-solid fa-xmark mr-2"></i>
          End Call
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i className="fa-solid fa-hand"></i>
        </button>
        <button className="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
    </div>
  </div>
</div>

  )
}





