export function RightPanelVideo(){
    return (
          <>
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
          </>  
    )
  }