import type { Movie } from "@/entities/movie/model/types";

import {
  BLOCKS_REGEXP,
  FORMAT_REGEXP,
  RELEASE_YEAR_REGEXP,
  ACTORS_REGEXP,
  TITLE_REGEXP,
} from "../constants";

export const parseMoviesTxt = (text: string): Omit<Movie, "id">[] => {
  const blocks = text.split(BLOCKS_REGEXP);
  const seen = new Set<string>();
  const items = blocks
    .map((block) => {
      const get = (regexp: RegExp) => (block.match(regexp)?.[1] ?? "").trim();

      const title = get(TITLE_REGEXP);
      const year = Number(get(RELEASE_YEAR_REGEXP));
      const format = get(FORMAT_REGEXP);
      const actorsLine = get(ACTORS_REGEXP);
      const actors = actorsLine
        ? actorsLine
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      return { title, year: year, format, actors } as Omit<Movie, "id">;
    })
    .filter((m) => m.title && m.year);

  return items.filter((m) => {
    const key = `${m.title.toLowerCase()}-${m.year}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};
