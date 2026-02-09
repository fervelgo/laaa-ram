import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ObjectRow } from "@/lib/supabase/types";

interface ObjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getObject(slug: string): Promise<ObjectRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("objects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ObjectRow;
}

export async function generateMetadata({ params }: ObjectPageProps) {
  const { slug } = await params;
  const object = await getObject(slug);

  if (!object) {
    return { title: "Objeto no encontrado | RAM" };
  }

  return {
    title: `${object.title} | RAM`,
    description: object.description || `${object.title} - ${object.cultura}`,
  };
}

export default async function ObjectPage({ params }: ObjectPageProps) {
  const { slug } = await params;
  const object = await getObject(slug);

  if (!object) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a la coleccion
          </Link>
          <span className="text-xl font-bold">RAM</span>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* Title section */}
        <div className="mb-8">
          <p className="text-sm text-neutral-500 mb-1">
            No. {object.piece_number}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{object.title}</h1>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {object.cultura && (
              <div>
                <p className="text-neutral-500">Cultura</p>
                <p className="font-medium">{object.cultura}</p>
              </div>
            )}
            {object.origen && (
              <div>
                <p className="text-neutral-500">Origen</p>
                <p className="font-medium">{object.origen}</p>
              </div>
            )}
            {object.periodo && (
              <div>
                <p className="text-neutral-500">Periodo</p>
                <p className="font-medium">{object.periodo}</p>
              </div>
            )}
            {object.material && (
              <div>
                <p className="text-neutral-500">Material</p>
                <p className="font-medium">{object.material}</p>
              </div>
            )}
            {object.dimensiones && (
              <div>
                <p className="text-neutral-500">Dimensiones</p>
                <p className="font-medium">{object.dimensiones}</p>
              </div>
            )}
          </div>
        </div>

        {/* 3D Viewer placeholder */}
        <div className="aspect-[4/3] bg-neutral-100 rounded-lg flex items-center justify-center mb-8">
          <div className="text-center text-neutral-400">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            <p className="text-lg font-medium">Visor 3D</p>
            <p className="text-sm">Proximamente</p>
          </div>
        </div>

        {/* Description */}
        {object.description && (
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Descripcion</h2>
            <p className="text-neutral-700">{object.description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
