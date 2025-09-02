import { Movie } from "@/entities/movie/model/types";

import { normalizeFormat } from "./normalizeFormat";

export const normalizeMovie = (raw: any): Movie => {
  return {
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    title: raw.title ?? raw.name ?? "",
    year: Number(raw.year ?? raw.year ?? 0),
    format: normalizeFormat(raw.format ?? raw.media ?? "DVD") as any,
    actors: Array.isArray(raw.actors)
      ? raw.actors
          .map((a: any) => (typeof a === "string" ? a : a?.name))
          .filter(Boolean)
      : typeof raw.actors === "string"
      ? raw.actors
          .split(",")
          .map((actor: string) => actor.trim())
          .filter(Boolean)
      : [],
  };
};
