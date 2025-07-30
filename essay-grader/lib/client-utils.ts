import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join class names together and merge Tailwind classes.
 *
 * @param inputs - Any number of class values (strings, arrays, objects).
 * @returns A single string of merged class names, with Tailwind classes deduplicated.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
