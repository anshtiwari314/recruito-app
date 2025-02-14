import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {PostReq} from '../functions/requests'
import { useData } from "../context/DataWrapper";

function RatingsComp({text,ratings,setRatings}){
  const [hover, setHover] = useState(ratings[text.toLowerCase().split(' ').join('-')]);
  //const [rating, setRating] = useState(0);

  function myFunc(p,text,star){
    let ob = {}
    ob[text.toLowerCase().split(' ').join('-')] = star
    return {...p,...ob}
  }
  return (
          <div className="mb-4">         
              <h3 className="font-medium mb-2">{text}</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${
                      (hover || ratings[text.toLowerCase().split(' ').join('-')]) >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                    size={24}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRatings(p=> { return myFunc(p,text,star)})}
                  />
                ))}
              </div>
              </div>
  )
}

const FeedbackModel = ({isOpen,setIsOpen}) => {
  
  const [feedback, setFeedback] = useState("");
  const [ratings,setRatings] = useState({})
  
  //@ts-ignore
  const {socket2} = useData()

  let feedbackList = [
    'Problem Solving Ability',
    'Technical Competency',
    'Communication skills',
    'Adaptability'
  ]

  const handleSubmit = () => {
    if(socket2===null)
      return ;
    
    console.log("Feedback submitted:", feedback);
    console.log("Rating submitted:", ratings);
    
    let feedBackObj = {}

    for (let i of feedbackList){
      feedBackObj[i.toLowerCase().split(' ').join('-')]=0 
    }

    let data ={
      ...feedBackObj,
      ...ratings,
      feedback
    }
    console.log(data)
    socket2.emit('feedback_form_req',data)

    setFeedback("");
    //setRatings({});
    setIsOpen(false);
  };

  useEffect(()=>{
    console.log('ratings is ',ratings)
  },[ratings])

  
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Feedback Form</h2>
            {feedbackList.map((text,i)=><RatingsComp text={text} ratings={ratings} setRatings={setRatings} key={i}/>)}
            
            <textarea
              className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) :null}
    </>
  );
};

export default FeedbackModel;
