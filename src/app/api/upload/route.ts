import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderType = formData.get("folder") as string;
    const title = formData.get("title") as string | null;
    const date = formData.get("date") as string | null;
    const category = formData.get("category") as string | null;
    const uploadFolder = folderType === "galery" ? "love_story/galery" : "love_story/memories";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const context: Record<string, string> = {};
    if (title) context.title = title;
    if (date) context.date = date;
    if (category) context.category = category;

    const normalizedCategory = category
      ? category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
      : "";
    const tags = normalizedCategory ? [`memories_${normalizedCategory}`] : undefined;

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: uploadFolder,
            public_id: file.name ? file.name.split('.').slice(0, -1).join('.') : undefined,
            resource_type: "auto",
            context,
            tags,
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
