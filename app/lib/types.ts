export interface Tour {
  id: number | string;
  created_at: string;
  name?: string | null;
  title?: string | null;
  description: string;
  pueblo_slug: string;
  price: number | null;
  price_min?: number | null;
  price_max?: number | null;
  image_url: string;
  duration_hours: number;
  is_active: boolean;
  meeting_point: string;
  slug: string;
}

export const normalizeSlug = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const lowered = trimmed.toLowerCase();
  if (lowered === 'undefined' || lowered === 'null') {
    return undefined;
  }
  return trimmed;
};

export const normalizeId = (value?: string | number | null) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = String(value).trim();
  return trimmed ? trimmed : undefined;
};
