import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/store";

export default function ContentPanelFooter() {
  const currentQPState = useAppSelector((state) => state.qpReducer);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null); // 'success', 'error', or null
  const [loading, setLoading] = useState(false);

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleSendNotes = () => {
    setLoading(true);
    setStatus(null);
    console.log(notes);

    // Simulate sending notes to an API
    setTimeout(() => {
      const success = Math.random() > 0.5; // Simulate success or failure randomly

      if (success) {
        setStatus("success");
        setNotes(""); // Clear input after success
      } else {
        setStatus("error");
      }

      setLoading(false);
    }, 2000); 

    // Replace 'apiurl' with your actual API URL
    /*
    const apiUrl = "https://example.com/api/endpoint";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        notes: notes,
        jobId: currentQPState.jobId,
        agentId: currentQPState.agentId,
        custEmailId: currentQPState.custEmailId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API if needed
        setStatus("success");
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        setStatus("error");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
    */
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);

      return () => clearTimeout(timer); // Clear the timer when the component unmounts
    }
  }, [status]);

  return (
    <div id="ai-query" className="fixed bottom-20 left-6 right-[340px]">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-neutral-200">
        <div className="flex items-center space-x-3">
          <textarea
            placeholder="Enter your notes here ..."
            className="flex-grow p-2.5 bg-neutral-50 rounded-lg border-0 focus:ring-2 focus:ring-neutral-200 resize-none max-h-[150px] overflow-y-auto"
            value={notes}
            onChange={handleNotesChange}
            disabled={loading}
            rows={3} // Use curly braces to pass a number value
          ></textarea>
          <button
            className="p-2.5 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white"
            onClick={handleSendNotes}
            disabled={loading}
          >
            {loading ? (
              <i className="flex space-x-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
              </i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
          {/* Status Messages */}
          {status === "success" && (
            <p className="mt-2 text-green-600">Notes sent successfully!</p>
          )}
          {status === "error" && (
            <p className="mt-2 text-red-600">
              Failed to send notes. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

