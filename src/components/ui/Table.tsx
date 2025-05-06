import React from "react";
import { cn } from "../../lib/utils";

export const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full border-collapse">{children}</table>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b">{children}</tr>
);

export const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`p-2 text-sm ${className}`}>{children}</td>
);

export const TableHead = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => <th className={cn("p-2 text-left font-medium text-sm", className)}>{children}</th>