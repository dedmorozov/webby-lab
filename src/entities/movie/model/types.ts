export type Query = { title?: string; actor?: string };

export interface Movie {
  id: string;
  title: string;
  year: number;
  format: string;
  actors: string[];
}

export type MoviesState = {
  items: Movie[];
  loading: boolean;
  error: string | null;
  query: Query;
};
