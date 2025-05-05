import { useEffect, useState } from "react";
import { useData } from "@/context/DataWrapper";
import NewUi from "@/components/old-NewUi";
import MyLargerVideoComp from "@/components/MyLargerVideoComp";
import MySmallerVideoComp from "@/components/MySmallerVideoComp";

export default function VideoLayout({
  openSideWindow,
  isMobile,
  toggleRmWindow,
}: {
  openSideWindow: boolean;
  isMobile: boolean;
  toggleRmWindow: boolean;
}) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  //@ts-ignore
  const {
    users,
    usersArrRef,
    largeVideo,
    setLargeVideo,
    largeVideoRef,
    isHost,
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
      <div
        className={`flex flex-col md:flex-row h-[90vh] z-0 w-[100vw] md:${
          openSideWindow ? "w-[78vw]" : "w-[98vw]"
        }`}
      >
        <div className="flex justify-center items-center  w-full h-[90%] md:w-[80%] md:h-auto">
          {toggleRmWindow || isHost ? (
            <NewUi isMobile={isMobile} />
          ) : (
            largeVideo && (
              <MyLargerVideoComp
                e={largeVideo}
                //num={4193}
                isMobile={isMobile}
              />
            )
          )}
        </div>

        <div
          className="smaller-video-holder 
            flex 
            flex-row  md:flex-col 
            w-[100vw] md:w-[20%] 
            h-fit md:h-full
            overflow-x-scroll md:overflow-x-hidden
            overflow-y-hidden md:overflow-y-scroll
            bg-gray-500 md:bg-transparent"
        >
          {/* {users.length>0 && console.log("loggin before render",users)} */}
          {users.map((e: any, i: number) => {
            // console.log('triggered',e.id)
            const randomValue = Math.random();
            if (e.remove === true) {
              return null;
            }

            return (
              <div className="my-4" key={i * randomValue}>
                <MySmallerVideoComp
                  e={e}
                  //muted={e.microphoneStatus===true?false:true}
                  //muted = {false}
                  num={i}
                  isMobile={isMobile}
                  setSelectedNumber={setSelectedNumber}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

