import React,{ useEffect, useRef, useState } from "react";
import { useData } from "../context/DataWrapper";
import MyLargerVideoComp, { UserStreamType } from "../components/MyLargerVideoComp";
import ContentPanelMain from "./ContentPanelMain";
import ContentPanelFooter from "./ContentPanelFooter";
import { useAppSelector } from "../store/store";
import { UserType } from "../reducers/usersReducer";

export default function ContentPanel({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const { isHost } = useAppSelector((state) => state.qpReducer);
  const largeVideoRef=useRef<UserStreamType>(null);
  // //@ts-ignore
  // const {
  //   user,
  //   usersArrRef,
  //   largeVideo,
  //   setLargeVideo,
  //   // largeVideoRef,
  // }:any = useData();
  const users=useAppSelector((state)=>state.usersReducer)
  let number = 3;
  const [largeVideo, setLargeVideo] = useState<UserStreamType | null>(null);
  const usersArrRef = useRef<UserType[]>([]);
  useEffect(() => {
  usersArrRef.current = users;
  }, [users]);

  useEffect(() => {
    // Handling of screen to be shown to client - video of host.
    if (users?.length === 0) return;

    //  console.log("i am users length 2",users.length)
    if (!isHost) {
      // Valid only in case of candidate joining i.e. not host
      if (users?.length === 1 && largeVideoRef.current !== users[0]) {
        // set large video to the joined user - same as candidate
        largeVideoRef.current = users[0];
        setLargeVideo(largeVideoRef.current);
      } else if (users?.length > 1 && selectedNumber === null) {
        largeVideoRef.current = users[users?.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
        users?.length > 1 &&
        selectedNumber !== null &&
        selectedNumber > usersArrRef.current.length - 1
      ) {
        //if user left
        largeVideoRef.current = usersArrRef.current[usersArrRef.current.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
       users?.length > 1 &&
        selectedNumber !== null &&
        largeVideoRef.current !== users[selectedNumber]
      ) {
        largeVideoRef.current = users[selectedNumber];
        setLargeVideo(users[selectedNumber]);
      }
    }
  }, [users, selectedNumber]);
  console.log("user updated", users);

  return (
    <>
      {isHost ? (
        <div style={{
        //border:'0.2rem solid green',
        height:'100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
        }}>
          

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
  );
}

