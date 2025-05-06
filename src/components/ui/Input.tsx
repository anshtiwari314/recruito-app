import React from "react";
import { cn } from "../../lib/utils";

export const Input = ({ placeholder, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black",
        className
      )}
      {...props}
    />
  );
};
