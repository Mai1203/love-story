import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "love_story/galery",
      resource_type: "image",
      context: true,
      max_results: 100,
    });

    if (result.resources.length > 0) {
      console.log("[Gallery API] Sample resource:", JSON.stringify(result.resources[0], null, 2));
    } else {
      console.log("[Gallery API] No resources found");
    }

    const items = result.resources.map((resource: any) => {
      // Extract filename from public_id: "love_story/galery/my-photo" → "my-photo"
      const filenameFromId = resource.public_id?.split("/").pop() || "Sin título";

      return {
        id: resource.public_id,
        url: resource.secure_url,
        publicId: resource.public_id,
        title: resource.context?.custom?.title || filenameFromId,
        date:
          resource.context?.custom?.date ||
          resource.created_at?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        type: "image" as const,
      };
    });

    // Sort by date descending
    items.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
