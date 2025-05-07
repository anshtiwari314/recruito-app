import React from "react"

import { useEffect, useRef, useState } from "react"
import MyLargerVideoComp, { type UserStreamType } from "../components/MyLargerVideoComp"
import ContentPanelMain from "./ContentPanelMain"
import ContentPanelFooter from "./ContentPanelFooter"
import { useAppSelector } from "../store/store"
import type { UserType } from "../reducers/usersReducer"

export default function ContentPanel({
  isMobile,
}: {
  isMobile: boolean
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const { isHost } = useAppSelector((state) => state.qpReducer)
  const largeVideoRef = useRef<UserStreamType>(null)
  // //@ts-ignore
  // const {
  //   user,
  //   usersArrRef,
  //   largeVideo,
  //   setLargeVideo,
  //   // largeVideoRef,
  // }:any = useData();
  const users = useAppSelector((state) => state.usersReducer)
  const number = 3
  const [largeVideo, setLargeVideo] = useState<UserStreamType | null>(null)
  const usersArrRef = useRef<UserType[]>([])
  useEffect(() => {
    usersArrRef.current = users
  }, [users])

  useEffect(() => {
    // Handling of screen to be shown to client - video of host.
    if (users?.length === 0) return

    let selectedUser:UserType = {}

    //  console.log("i am users length 2",users.length)
    if (!isHost) {
      // Valid only in case of candidate joining i.e. not host
      if (users?.length === 1 && largeVideoRef.current !== users[0]) {
        // set large video to the joined user - same as candidate
        largeVideoRef.current = users[0]
        selectedUser = users[0]
        setLargeVideo(largeVideoRef.current)
      } else if (users?.length > 1 && selectedNumber === null) {
        largeVideoRef.current = users[users?.length - 1]
        selectedUser = users[users?.length - 1]
        setLargeVideo(largeVideoRef.current)
      } else if (users?.length > 1 && selectedNumber !== null && selectedNumber > usersArrRef.current.length - 1) {
        //if user left
        largeVideoRef.current = usersArrRef.current[usersArrRef.current.length - 1]
        selectedUser = usersArrRef.current[usersArrRef.current.length - 1]
        setLargeVideo(largeVideoRef.current)
      } else if (users?.length > 1 && selectedNumber !== null && largeVideoRef.current !== users[selectedNumber]) {
        largeVideoRef.current = users[selectedNumber]
        selectedUser = users[selectedNumber]
        setLargeVideo(users[selectedNumber])
      }
    }

    return () => {
      // Clean up references when component unmounts
      largeVideoRef.current = null
      setLargeVideo(null)
    }
  }, [users, selectedNumber, isHost])
  console.log("user updated", users)

  return (
    <>
      {isHost ? (
        <div
          style={{
            //border:'0.2rem solid green',
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ContentPanelMain />

          <ContentPanelFooter />
        </div>
      ) : (
        largeVideo && (
          <MyLargerVideoComp
            e={largeVideo}
            //num={4193}
            isMobile={isMobile}
          />
        )
      )}
    </>
  )
}
