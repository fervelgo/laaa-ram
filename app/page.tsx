import { createClient } from "@/lib/supabase/server";
import { ObjectGrid } from "@/components/grid/ObjectGrid";
import { Footer } from "@/components/layout/Footer";
import type { ObjectSummary } from "@/lib/supabase/types";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getObjects(): Promise<ObjectSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("objects")
    .select(
      "id, piece_number, title, slug, cultura, origen, periodo, material, dimensiones, thumbnail_url"
    )
    .eq("is_published", true)
    .order("piece_number", { ascending: true });

  if (error) {
    console.error("Error fetching objects:", error);
    return [];
  }

  return data ?? [];
}

export default async function HomePage() {
  const objects = await getObjects();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 relative">
        <ObjectGrid objects={objects} />
      </div>
      <Footer />
    </main>
  );
}
