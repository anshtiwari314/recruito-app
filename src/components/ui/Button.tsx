import React from "react";
import { cn } from "../../lib/utils.ts";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost"; // ya jo tu use kare
};


const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "default",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md transition disabled:opacity-50";

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-black text-black hover:bg-gray-100",
    ghost: "text-black hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
};


export default Button;
