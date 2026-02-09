// Database types for Supabase tables

export interface ObjectRow {
  id: string;
  piece_number: string;
  title: string;
  slug: string;
  description: string | null;
  cultura: string | null;
  origen: string | null;
  periodo: string | null;
  material: string | null;
  dimensiones: string | null;
  thumbnail_url: string | null;
  model_preview_url: string | null;
  model_full_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ObjectImageRow {
  id: string;
  object_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      objects: {
        Row: ObjectRow;
        Insert: Omit<ObjectRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ObjectRow, "id" | "created_at" | "updated_at">>;
      };
      object_images: {
        Row: ObjectImageRow;
        Insert: Omit<ObjectImageRow, "id" | "created_at">;
        Update: Partial<Omit<ObjectImageRow, "id" | "created_at">>;
      };
    };
  };
}

// Convenience type for grid display (subset of full ObjectRow)
export type ObjectSummary = Pick<
  ObjectRow,
  | "id"
  | "piece_number"
  | "title"
  | "slug"
  | "cultura"
  | "origen"
  | "periodo"
  | "material"
  | "dimensiones"
  | "thumbnail_url"
>;
