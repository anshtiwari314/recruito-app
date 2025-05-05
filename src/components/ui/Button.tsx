import React from "react";
import { cn } from "../../lib/utils.ts"; 

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
