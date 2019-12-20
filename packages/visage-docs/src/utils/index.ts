import createSlug from 'slugify';

export function slugify(text: string): string {
  return createSlug(text, { lower: true });
}
