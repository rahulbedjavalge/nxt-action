import "server-only";
import { auth } from "./auth";
import type { Database, GoogleDriveFile } from "@/types";

const DB_FILENAME = "nxt-action-db.json";
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_BASE = "https://www.googleapis.com/upload/drive/v3";

const INITIAL_DB: Database = {
  version: 1,
  contacts: [],
  interactions: [],
  tasks: [],
};

async function getAccessToken(): Promise<string> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("No access token available. Please sign in again.");
  }
  if (session.error === "RefreshAccessTokenError") {
    throw new Error("Session expired. Please sign in again.");
  }
  return session.accessToken;
}

async function findDbFile(accessToken: string): Promise<string | null> {
  const query = encodeURIComponent(`name='${DB_FILENAME}'`);
  const url = `${DRIVE_API_BASE}/files?spaces=appDataFolder&q=${query}&fields=files(id,name)`;
  
  console.log("Calling Drive API:", url);
  console.log("Token (first 20 chars):", accessToken?.substring(0, 20));
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Drive API error status:", response.status);
    console.error("Drive API error body:", errorText);
    throw new Error(`Drive API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const files: GoogleDriveFile[] = data.files || [];

  return files.length > 0 ? files[0].id : null;
}

async function createDbFile(accessToken: string): Promise<string> {
  const metadata = {
    name: DB_FILENAME,
    parents: ["appDataFolder"],
    mimeType: "application/json",
  };

  // Create file with metadata and content in one request
  const boundary = "nxt_action_boundary";
  const body = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    "Content-Type: application/json",
    "",
    JSON.stringify(INITIAL_DB),
    `--${boundary}--`,
  ].join("\r\n");

  const response = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Error creating DB file:", error);
    throw new Error("Failed to create database file");
  }

  const data = await response.json();
  return data.id;
}

export async function getOrCreateDbFileId(): Promise<string> {
  const accessToken = await getAccessToken();
  let fileId = await findDbFile(accessToken);

  if (!fileId) {
    console.log("Creating new database file...");
    fileId = await createDbFile(accessToken);
  }

  return fileId;
}

export async function readDb(): Promise<Database> {
  const accessToken = await getAccessToken();
  const fileId = await getOrCreateDbFileId();

  const response = await fetch(
    `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      // File was deleted, create new one
      await createDbFile(accessToken);
      return INITIAL_DB;
    }
    const error = await response.json();
    console.error("Error reading DB file:", error);
    throw new Error("Failed to read database file");
  }

  try {
    const data = await response.json();
    return data as Database;
  } catch {
    // Invalid JSON, return initial DB
    return INITIAL_DB;
  }
}

export async function writeDb(db: Database): Promise<void> {
  const accessToken = await getAccessToken();
  const fileId = await getOrCreateDbFileId();

  const response = await fetch(
    `${DRIVE_UPLOAD_BASE}/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(db),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Error writing DB file:", error);
    throw new Error("Failed to save database file");
  }
}

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 writes per minute

export async function checkRateLimit(): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.email || "anonymous";
  const now = Date.now();

  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}
