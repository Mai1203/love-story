import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const CATEGORY_TITLES = [
  "Amanecer",
  "Desayuno",
  "Camino",
  "Glamping",
  "Cena",
  "Estrellas",
  "Nosotros",
];

function normalizeTag(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getCategoryFromResource(resource: any) {
  const contextCategory = resource.context?.custom?.category;
  if (contextCategory) return contextCategory;

  const tag = resource.tags?.find((item: string) => item.startsWith("memories_"));
  if (!tag) return "Nosotros";

  const normalizedTag = tag.replace(/^memories_/, "");
  return (
    CATEGORY_TITLES.find(
      (title) => normalizeTag(title) === normalizedTag
    ) || "Nosotros"
  );
}

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "love_story/memories",
      resource_type: "image",
      context: true,
      tags: true,
      max_results: 100,
    });

    result.resources.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const imagesByCategory = CATEGORY_TITLES.map(() => [] as string[]);
    const uncategorized: string[] = [];

    for (const resource of result.resources) {
      const category = getCategoryFromResource(resource);
      const categoryIndex = CATEGORY_TITLES.findIndex(
        (title) => title.toLowerCase() === String(category).trim().toLowerCase()
      );

      if (categoryIndex >= 0) {
        imagesByCategory[categoryIndex].push(resource.secure_url);
      } else {
        uncategorized.push(resource.secure_url);
      }
    }

    if (uncategorized.length > 0) {
      imagesByCategory[CATEGORY_TITLES.length - 1].push(...uncategorized);
    }

    return NextResponse.json({ images: imagesByCategory });
  } catch (error) {
    console.error("Memories fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}
