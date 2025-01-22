
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
    <div
      id="right-panel"
      className="w-80 bg-white border-l border-neutral-200 flex flex-col"
    >
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold mb-4 text-neutral-900">
          Participants (2)
        </h2>
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="text-sm bg-black/50 text-white px-2 py-1 rounded">
                Varun
              </span>
              <div className="flex space-x-1">
                <i className="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
                <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=INT"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="text-sm bg-black/50 text-white px-2 py-1 rounded">
                Interviewer
              </span>
              <div className="flex space-x-1">
                <i className="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
                <i className="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="resources" className="flex-grow p-4 overflow-y-auto">
        <h2 className="font-semibold mb-4 text-neutral-900">Resources</h2>
        <div className="space-y-3">
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
                  Technical Assessment Framework
                </div>
              </div>
              <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</div>;
