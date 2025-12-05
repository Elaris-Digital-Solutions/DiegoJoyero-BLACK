import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const CATEGORY_ALIASES: Record<string, string> = {
  anillos: 'Anillos',
  aros: 'Aros',
  aretes: 'Aros',
  broches: 'Broches',
  cadenas: 'Cadenas',
  collares: 'Cadenas',
  dijes: 'Dijes',
  charms: 'Dijes',
  sets: 'Sets',
  pulseras: 'Sets',
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeCategory(category?: string | null) {
  if (!category) return 'Colección';

  const key = category.trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? category.trim();
}
