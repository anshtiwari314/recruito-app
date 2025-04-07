import React,{ useEffect, useState } from "react";
import { useData } from "../context/DataWrapper";
import MyLargerVideoComp from "../components/MyLargerVideoComp";
import ContentPanelMain from "./ContentPanelMain";
import ContentPanelFooter from "./ContentPanelFooter";
import { useAppSelector } from "../store/store";

export default function ContentPanel({
  isMobile,
}: {
  isMobile: boolean;
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const { isHost } = useAppSelector((state) => state.qpReducer);
  //@ts-ignore
  const {
    user,
    usersArrRef,
    largeVideo,
    setLargeVideo,
    largeVideoRef,
  }:any = useData();
  const username=useAppSelector((state)=>state.usersReducer)
  let number = 3;

  useEffect(() => {
    // Handling of screen to be shown to client - video of host.
    if (username?.length === 0) return;

    //  console.log("i am users length 2",users.length)
    if (!isHost) {
      // Valid only in case of candidate joining i.e. not host
      if (username?.length === 1 && largeVideoRef.current !== username[0]) {
        // set large video to the joined user - same as candidate
        largeVideoRef.current = username[0];
        setLargeVideo(largeVideoRef.current);
      } else if (username?.length > 1 && selectedNumber === null) {
        largeVideoRef.current = username[username?.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
        username?.length > 1 &&
        selectedNumber !== null &&
        selectedNumber > usersArrRef.current.length - 1
      ) {
        //if user left
        largeVideoRef.current = usersArrRef.current[usersArrRef.current.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
       username?.length > 1 &&
        selectedNumber !== null &&
        largeVideoRef.current !== username[selectedNumber]
      ) {
        largeVideoRef.current = username[selectedNumber];
        setLargeVideo(username[selectedNumber]);
      }
    }
  }, [username, selectedNumber]);
  console.log("user updated", username);

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

