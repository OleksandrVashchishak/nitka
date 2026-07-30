import type { Href } from "expo-router";

/** Expo typed routes не завжди знають group-шляхи — кастимо явно. */
export function href(path: string): Href {
  return path as Href;
}
