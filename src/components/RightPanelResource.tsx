export function RIghtPanelResource(){
    return (
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
           
    )
  }