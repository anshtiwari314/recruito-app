import React, {useState,useRef} from 'react'

export default function ShowMessage(){
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
  
    // Function to display messages, similar to the original showMessage
    const displayMessage = (msg, type) => {
      setMessage(msg);
      setMessageType(type);
      setIsMessageBoxVisible(true);
    };
  
    // Function to hide the message box
    const hideMessage = () => {
      setIsMessageBoxVisible(false);
      setMessage('');
      setMessageType('');
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 font-inter">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Alert</h1>
  
          {/* <div className="space-y-4 mb-6">
            <button
              onClick={() => displayMessage('This is a success message!', 'success')}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            >
              Show Success Message
            </button>
            <button
              onClick={() => displayMessage('This is an error message!', 'error')}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Show Error Message
            </button>
            <button
              onClick={() => displayMessage('This is an info message!', 'info')}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Show Info Message
            </button>
            <button
              onClick={hideMessage}
              className="w-full py-3 px-6 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
            >
              Hide Message
            </button>
          </div> */}
  
          {/* The MessageBox component is rendered here */}
          <MessageBox
            message={message}
            type={messageType}
            isVisible={isMessageBoxVisible}
          />
        </div>
      </div>
    );
  }
  
  // MessageBox Component: This is the React equivalent of the showMessage function's logic
  const MessageBox = ({ message, type, isVisible }) => {
    // Determine the CSS classes based on the 'type' prop
    const getClasses = () => {
      let baseClasses = 'mt-6 p-4 rounded-lg text-sm';
      if (!isVisible) {
        baseClasses += ' hidden'; // Hide if not visible
      }
  
      switch (type) {
        case 'success':
          return `${baseClasses} bg-green-100 text-green-700`;
        case 'error':
          return `${baseClasses} bg-red-100 text-red-700`;
        case 'info':
          return `${baseClasses} bg-blue-100 text-blue-700`;
        default:
          return baseClasses; // Default or no type
      }
    };
  
    return (
      <div className={getClasses()} role="alert">
        {message}
      </div>
    );
}