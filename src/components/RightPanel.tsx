import { RightPanelVideo } from "./RightPanelVideo"
import { RIghtPanelResource } from "./RightPanelResource"

export default function RightPanel(){
    return (
      <div
        id="right-panel"
        className="w-80 bg-white border-l border-neutral-200 flex flex-col"
      >
        
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-semibold mb-4 text-neutral-900">
            Participants (2)
          </h2>
          <div className="space-y-4">
              <RightPanelVideo/>
              <RightPanelVideo/>
          </div>
        </div>
        <div id="resources" className="flex-grow p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4 text-neutral-900">Resources</h2>
          <div className="space-y-3">
              <RIghtPanelResource/>
              <RIghtPanelResource/>
          </div>
        </div>
      </div>
    )
  }