<div id="app" class="min-h-screen bg-neutral-50">
  <header id="header" class="w-full bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between shadow-sm">
    <div class="flex items-center space-x-4">
      <i class="fa-solid fa-arrow-left text-neutral-600"></i>
      <div class="h-8 w-[2px] bg-neutral-200"></div>
      <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=Logo" class="h-8" alt="Logo">
      <div class="text-sm text-neutral-500">Recruiter Copilot</div>
    </div>
    <div class="flex items-center space-x-4">
      <button class="flex items-center px-3 py-1.5 bg-neutral-50 rounded-full text-sm text-neutral-600">
        <i class="fa-solid fa-circle text-neutral-500 mr-2 text-xs"></i>
        Live
      </button>
      <i class="fa-solid fa-download text-neutral-600"></i>
      <i class="fa-solid fa-ellipsis-vertical text-neutral-600"></i>
    </div>
  </header>
  <main id="main-content" class="flex h-[calc(100vh-120px)]">
    <div id="content-panel" class="flex-grow p-6 overflow-y-auto">
      <div class="mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-semibold mb-2 text-neutral-900">Interview: EDI Developer Position</h1>
          <div class="flex items-center text-sm text-neutral-500">
            <i class="fa-regular fa-calendar mr-2"></i>
            <span>Friday, September 22, 2025</span>
            <span class="mx-2">•</span>
            <span>08:30 PM</span>
            <span class="mx-2">•</span>
            <span class="flex items-center"><i class="fa-regular fa-clock mr-1"></i> 32:45</span>
          </div>
        </div>
        <button class="px-4 py-2 bg-neutral-600 text-white rounded-lg text-sm font-medium hover:bg-neutral-700">
          End Interview
        </button>
      </div>
      <div id="transcription" class="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-900">Live Transcription</h2>
          <button class="text-sm text-neutral-600 hover:text-neutral-700">
            <i class="fa-solid fa-expand mr-1"></i> Expand
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex space-x-3">
            <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=INT" class="w-8 h-8 rounded-full">
            <div>
              <div class="flex items-center">
                <span class="font-medium text-neutral-900">Interviewer</span>
                <span class="text-sm text-neutral-500 ml-2">08:31 PM</span>
              </div>
              <p class="text-neutral-700">Can you explain your experience with EDI integration projects?</p>
            </div>
          </div>
          <div class="flex space-x-3">
            <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA" class="w-8 h-8 rounded-full">
            <div>
              <div class="flex items-center">
                <span class="font-medium text-neutral-900">Varun</span>
                <span class="text-sm text-neutral-500 ml-2">08:32 PM</span>
              </div>
              <p class="text-neutral-700">I have worked on multiple EDI projects involving X12 and EDIFACT standards...</p>
            </div>
          </div>
        </div>
      </div>
      <div id="ai-suggestions" class="mb-6 bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
  <div class="flex justify-between items-start">
    <div>
      <h3 class="text-lg font-semibold mb-3 text-neutral-900">AI Suggestions</h3>
      <div class="space-y-2 text-sm">
        <label class="flex items-center text-neutral-700">
          <input type="radio" name="suggestions" class="mr-2 text-neutral-600" checked="">
          Strong understanding of EDI standards demonstrated
        </label>
        <label class="flex items-center text-neutral-700">
          <input type="radio" name="suggestions" class="mr-2 text-neutral-600">
          Experience with integration platforms verified
        </label>
        <label class="flex items-center text-neutral-700">
          <input type="radio" name="suggestions" class="mr-2 text-neutral-600">
          Follow up on cloud integration experience
        </label>
      </div>
    </div>
  </div>
</div>
      <div id="ai-query" class="fixed bottom-20 left-6 right-[340px]">
        <div class="bg-white rounded-lg shadow-lg p-4 border border-neutral-200">
          <div class="flex items-center space-x-3">
            <div class="flex items-center px-3 py-1.5 bg-neutral-50 text-neutral-700 rounded-full text-sm mr-2">
              <i class="fa-solid fa-robot mr-2"></i>
              AI Assistant
            </div>
            <input type="text" placeholder="Ask follow-up questions or request analysis..." class="flex-grow p-2.5 bg-neutral-50 rounded-lg border-0 focus:ring-2 focus:ring-neutral-200">
            <button class="p-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
              <i class="fa-solid fa-microphone"></i>
            </button>
            <button class="p-2.5 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="right-panel" class="w-80 bg-white border-l border-neutral-200 flex flex-col">
      <div class="p-4 border-b border-neutral-200">
        <h2 class="font-semibold mb-4 text-neutral-900">Participants (2)</h2>
        <div class="space-y-4">
          <div class="relative">
            <div class="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=VA" class="w-full h-full object-cover">
            </div>
            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span class="text-sm bg-black/50 text-white px-2 py-1 rounded">Varun</span>
              <div class="flex space-x-1">
                <i class="fa-solid fa-microphone-slash bg-black/50 text-white p-1 rounded"></i>
                <i class="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-video bg-neutral-200 rounded-lg overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?scale=200&amp;seed=INT" class="w-full h-full object-cover">
            </div>
            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span class="text-sm bg-black/50 text-white px-2 py-1 rounded">Interviewer</span>
              <div class="flex space-x-1">
                <i class="fa-solid fa-microphone bg-black/50 text-white p-1 rounded"></i>
                <i class="fa-solid fa-video bg-black/50 text-white p-1 rounded"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="resources" class="flex-grow p-4 overflow-y-auto">
  <h2 class="font-semibold mb-4 text-neutral-900">Resources</h2>
  <div class="space-y-3">
    <div class="p-3 bg-neutral-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center">
            <i class="fa-regular fa-file-lines mr-2 text-neutral-600"></i>
            <div class="text-sm font-medium text-neutral-900">Job Description</div>
          </div>
          <div class="text-sm text-neutral-600 mt-1">EDI Developer Position Details</div>
        </div>
        <button class="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    </div>
    <div class="p-3 bg-neutral-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center">
            <i class="fa-regular fa-clipboard mr-2 text-neutral-600"></i>
            <div class="text-sm font-medium text-neutral-900">Interview Guide</div>
          </div>
          <div class="text-sm text-neutral-600 mt-1">Technical Assessment Framework</div>
        </div>
        <button class="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  </main>
  <div id="control-panel" class="fixed bottom-0 w-full bg-white border-t border-neutral-200 shadow-lg">
    <div class="flex items-center justify-between px-6 py-3">
      <div class="flex items-center space-x-2">
        <span class="flex items-center px-3 py-1.5 bg-neutral-50 rounded-full text-sm text-neutral-600">
          <i class="fa-solid fa-circle mr-2 text-xs"></i>
          32:45
        </span>
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-table-cells"></i>
        </button>
        <button class="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
          <i class="fa-solid fa-video"></i>
        </button>
        <button class="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700">
          <i class="fa-solid fa-microphone"></i>
        </button>
        <button class="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-message"></i>
        </button>
        <button class="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-desktop"></i>
        </button>
        <div class="h-8 w-[2px] bg-neutral-200"></div>
        <button class="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg flex items-center">
          <i class="fa-solid fa-xmark mr-2"></i>
          End Call
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-hand"></i>
        </button>
        <button class="p-3 hover:bg-neutral-100 rounded-lg text-neutral-600">
          <i class="fa-solid fa-gear"></i>
        </button>
      </div>
    </div>
  </div>
</div>