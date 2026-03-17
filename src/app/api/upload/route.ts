import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Upload directory — outside the git repo so deploys don't wipe it
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      // Validate it's an image
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Limit to 50MB per file
      if (file.size > 50 * 1024 * 1024) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename: timestamp-hash.ext
      const ext = path.extname(file.name) || ".jpg";
      const hash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 8);
      const filename = `${Date.now()}-${hash}${ext}`;

      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, buffer);

      // Return the URL path that will be served by the /api/uploads/[filename] route
      urls.push(`/api/uploads/${filename}`);
    }

    if (!urls.length) {
      return NextResponse.json(
        { error: "No valid image files provided" },
        { status: 400 }
      );
    }

    return NextResponse.json({ urls });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
