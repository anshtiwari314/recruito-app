import { useEffect, useState } from "react";
import { useData } from "@/context/DataWrapper";
import MyLargerVideoComp from "@/components/MyLargerVideoComp";
import ContentPanelHeader from "./ContentPanelHeader";
import { InitialLoadData } from "@/pages/MainPage";
import ContentPanelMain from "./ContentPanelMain";
import ContentPanelFooter from "./ContentPanelFooter";
import { useAppSelector } from "@/store/store";

export default function ContentPanel({
  openSideWindow,
  isMobile,
  toggleRmWindow,
  meetingDetails,
}: {
  openSideWindow: boolean;
  isMobile: boolean;
  toggleRmWindow: boolean;
  meetingDetails: InitialLoadData;
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const { isHost } = useAppSelector((state) => state.qpReducer);
  //@ts-ignore
  const {
    users,
    usersArrRef,
    largeVideo,
    setLargeVideo,
    largeVideoRef,
  } = useData();

  let number = 3;

  useEffect(() => {
    // Handling of screen to be shown to client - video of host.
    if (users.length === 0) return;

    //  console.log("i am users length 2",users.length)
    if (!isHost) {
      // Valid only in case of candidate joining i.e. not host
      if (users.length === 1 && largeVideoRef.current !== users[0]) {
        // set large video to the joined user - same as candidate
        largeVideoRef.current = users[0];
        setLargeVideo(largeVideoRef.current);
      } else if (users.length > 1 && selectedNumber === null) {
        largeVideoRef.current = users[users.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
        users.length > 1 &&
        selectedNumber !== null &&
        selectedNumber > usersArrRef.current.length - 1
      ) {
        //if user left
        largeVideoRef.current =
          usersArrRef.current[usersArrRef.current.length - 1];
        setLargeVideo(largeVideoRef.current);
      } else if (
        users.length > 1 &&
        selectedNumber !== null &&
        largeVideoRef.current !== users[selectedNumber]
      ) {
        largeVideoRef.current = users[selectedNumber];
        setLargeVideo(users[selectedNumber]);
      }
    }
  }, [users, selectedNumber]);

  return (
    <>
      {isHost ? (
        <>
          {meetingDetails.jobTitle ? (
            <ContentPanelHeader jobTitle={meetingDetails.jobTitle} />
          ) : (
            <ContentPanelHeader jobTitle="" />
          )}
          <ContentPanelMain />
          {/* <ContentPanelFooter /> */}
        </>
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

