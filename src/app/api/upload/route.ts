import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderType = formData.get("folder") as string;
    const title = formData.get("title") as string | null;
    const date = formData.get("date") as string | null;
    const uploadFolder = folderType === "galery" ? "love_story/galery" : "love_story/memories";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build context string to persist title & date in Cloudinary
    const contextParts: string[] = [];
    if (title) contextParts.push(`title=${title}`);
    if (date) contextParts.push(`date=${date}`);
    const context = contextParts.length > 0 ? contextParts.join("|") : undefined;

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: uploadFolder,
            public_id: file.name ? file.name.split('.').slice(0, -1).join('.') : undefined,
            resource_type: "auto",
            context,
            transformation: [
              { width: 1200, crop: "limit", quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
