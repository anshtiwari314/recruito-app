import "./leavepage.css";

export default function Leave() {
  return (
    <div className="flex justify-center items-center h-[98vh] w-full">
      <div className="w-[80%] h-[20vh] -translate-y-1/2 transform">
        <p className="text-center text-white w-full text-[2.5rem]">You have successfully left.</p>
        <div className="mt-12 flex justify-center flex-wrap text-center text-white">
            Thank you for participating in the interview. You have successfully left the interview.
        </div>
      </div>
    </div>
  );
}