import { useEffect, useState } from "react"
import { useData } from "@/context/DataWrapper"
import MyLargerVideoComp from "@/components/MyLargerVideoComp"
import { useAppSelector } from "@/store/store"
import DraggableChatWindow from "./DraggableChatWindow"
import ContentTemp from "./ContentTemp"
import FooterTemp from "./FooterTemp"

export default function ContentPanel({
  isMobile,
}: {
  isMobile: boolean
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const { isHost } = useAppSelector((state) => state.qpReducer)

  const { users, usersArrRef, largeVideo, setLargeVideo, largeVideoRef } = useData()

  useEffect(() => {
    // Handling of screen to be shown to client - video of host.
    if (users.length === 0) return

    if (!isHost) {
      // Valid only in case of candidate joining i.e. not host
      if (users.length === 1 && largeVideoRef.current !== users[0]) {
        // set large video to the joined user - same as candidate
        largeVideoRef.current = users[0]
        setLargeVideo(largeVideoRef.current)
      } else if (users.length > 1 && selectedNumber === null) {
        largeVideoRef.current = users[users.length - 1]
        setLargeVideo(largeVideoRef.current)
      } else if (users.length > 1 && selectedNumber !== null && selectedNumber > usersArrRef.current.length - 1) {
        //if user left
        largeVideoRef.current = usersArrRef.current[usersArrRef.current.length - 1]
        setLargeVideo(largeVideoRef.current)
      } else if (users.length > 1 && selectedNumber !== null && largeVideoRef.current !== users[selectedNumber]) {
        largeVideoRef.current = users[selectedNumber]
        setLargeVideo(users[selectedNumber])
      }
    }
  }, [users, selectedNumber, isHost, setLargeVideo, largeVideoRef, usersArrRef])

  console.log("users updated", users)

  return (
    <div className="h-full flex flex-col">
      <DraggableChatWindow />

      {isHost ? (
        <div className="h-full flex flex-col justify-between">
          <ContentTemp />
          <FooterTemp />
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          {largeVideo ? (
            <MyLargerVideoComp isMobile={isMobile} />
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-neutral-900 rounded-lg">
              
            </div>
          )}
        </div>
      )}
    </div>
  )
}
