const STORAGE_KEY = "created_by_admin";
const MAX_AGE_MINUTES = 480;

type StoredRoom = { id: string; time: number };

function parseStoredRooms(): StoredRoom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function pruneRooms(rooms: StoredRoom[]): StoredRoom[] {
  const now = Date.now();
  return rooms.filter(
    (room) => (now - room.time) / 1000 / 60 < MAX_AGE_MINUTES
  );
}

export function registerAdminRoom(roomId: string): void {
  const rooms = pruneRooms(parseStoredRooms());
  if (!rooms.some((room) => room.id === roomId)) {
    rooms.push({ id: roomId, time: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

export function isRoomAdmin(roomId: string): boolean {
  const rooms = pruneRooms(parseStoredRooms());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  return rooms.some((room) => room.id === roomId);
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function randomLetters(length: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => LETTERS[byte % LETTERS.length]).join("");
}

function generateRoomSlug(): string {
  return `${randomLetters(3)}-${randomLetters(3)}-${randomLetters(3)}`;
}

export function createRoomSlug(custom?: string): string {
  const trimmed = custom?.trim().toLowerCase().replace(/\s+/g, "-") ?? "";
  if (trimmed) {
    return trimmed
      .replace(/[^a-z-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  return generateRoomSlug();
}

export function isValidRoomSlug(slug: string): boolean {
  return /^[a-z]{3}-[a-z]{3}-[a-z]{3}$/.test(slug);
}

export function getMeetingJoinUrl(roomId: string): string {
  return `${window.location.origin}/${roomId}`;
}

const PARTICIPANT_NAME_KEY = "meeting_participant_name";

export function setParticipantName(name: string): void {
  sessionStorage.setItem(PARTICIPANT_NAME_KEY, name.trim());
}

export function getParticipantName(): string {
  return sessionStorage.getItem(PARTICIPANT_NAME_KEY)?.trim() ?? "";
}

export function normalizeParticipantName(name: string): string {
  return name.trim().replace(/\s+/g, " ").slice(0, 40);
}

export function isValidParticipantName(name: string): boolean {
  const normalized = normalizeParticipantName(name);
  return normalized.length >= 2 && normalized.length <= 40;
}
