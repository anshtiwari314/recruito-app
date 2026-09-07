export function getColorFromInitial(initial: string): string {
  const colors: Record<string, string> = {
    A: "#6366f1",
    B: "#8b5cf6",
    C: "#a855f7",
    D: "#d946ef",
    E: "#ec4899",
    F: "#f43f5e",
    G: "#f97316",
    H: "#eab308",
    I: "#84cc16",
    J: "#22c55e",
    K: "#10b981",
    L: "#14b8a6",
    M: "#06b6d4",
    N: "#0ea5e9",
    O: "#3b82f6",
    P: "#6366f1",
    Q: "#8b5cf6",
    R: "#a855f7",
    S: "#d946ef",
    T: "#ec4899",
    U: "#f43f5e",
    V: "#f97316",
    W: "#eab308",
    X: "#84cc16",
    Y: "#22c55e",
    Z: "#10b981",
  };
  return colors[initial.toUpperCase()] || "#64748b";
}

export function adjustColor(hex: string, amount: number): string {
  return (
    "#" +
    hex
      .replace(/^#/, "")
      .match(/.{2}/g)!
      .map((c) =>
        Math.max(0, Math.min(255, parseInt(c, 16) + amount))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export function getParticipantInitials(name: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
