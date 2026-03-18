import { NextResponse } from "next/server";
import { stat, open } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

// Map extensions to MIME types
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".m4v": "video/mp4",
  ".ogv": "video/ogg",
};

interface Params {
  params: Promise<{ filename: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { filename } = await params;

  // Prevent directory traversal
  const safeName = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, safeName);
  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  let fileStat;
  try {
    fileStat = await stat(filepath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fileSize = fileStat.size;
  const rangeHeader = request.headers.get("range");

  // Handle range requests (required for iOS video playback)
  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileHandle = await open(filepath, "r");
      const buffer = Buffer.alloc(chunkSize);
      await fileHandle.read(buffer, 0, chunkSize, start);
      await fileHandle.close();

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  // Full file response — still include Content-Length and Accept-Ranges
  const fileHandle = await open(filepath, "r");
  const buffer = Buffer.alloc(fileSize);
  await fileHandle.read(buffer, 0, fileSize, 0);
  await fileHandle.close();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileSize),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
