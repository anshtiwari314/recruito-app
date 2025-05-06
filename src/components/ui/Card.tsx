import React from "react";
import { cn } from "../../lib/utils";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("rounded-xl mt-2 shadow-md border p-4 bg-white", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("mt-2", className)}>{children}</div>;
};

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("mb-4", className)}>{children}</div>
}
export const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <h2 className={cn("text-xl font-semibold", className)}>{children}</h2>
}