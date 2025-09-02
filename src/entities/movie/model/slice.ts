import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { axiosPrivate } from "@/shared/api";
import { parseMoviesTxt } from "@/shared/lib/parseImport";
import { normalizeMovie } from "@/shared/lib/normalizeMovie";

import type { Movie, MoviesState, Query } from "./types";

const MOVIES = "movies";

const initialState: MoviesState = {
  items: [],
  loading: false,
  error: null,
  query: {},
};

export const fetchMovies = createAsyncThunk<Movie[], Query | void>(
  `${MOVIES}/fetch`,
  async (query) => {
    const params = new URLSearchParams();

    if (query) {
      if (query.title) params.set("title", query.title);
      if (query.actor) params.set("actor", query.actor);
    }

    const path = params.toString() ? `/${MOVIES}?${params}` : `/${MOVIES}`;

    const { data } = await axiosPrivate.get(path);

    const arr = Array.isArray(data) ? data : data?.data || [];
    const normalizedMovies: Movie[] = arr
      .map(normalizeMovie)
      .sort((a, b) => a.title.localeCompare(b.title));

    return normalizedMovies;
  }
);

export const addMovie = createAsyncThunk<Movie, Omit<Movie, "id">>(
  `${MOVIES}/add`,
  async (body) => {
    const res = await axiosPrivate.post<Movie>(`/${MOVIES}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return normalizeMovie(res.data);
  }
);

export const deleteMovie = createAsyncThunk<string, string>(
  `${MOVIES}/delete`,
  async (id) => {
    await axiosPrivate(`/${MOVIES}/${id}`, { method: "DELETE" });

    return id;
  }
);

export const importMovies = createAsyncThunk<number, File | string>(
  `${MOVIES}/import`,
  async (arg, { dispatch }) => {
    const raw = arg instanceof File ? await arg.text() : String(arg);
    const moviesText = raw
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .trim();

    try {
      const { data } = await axiosPrivate.post(`/${MOVIES}/import`, {
        movies: moviesText,
      });

      if (
        data &&
        typeof data === "object" &&
        "status" in data &&
        data.status === 0
      ) {
        throw new Error(data?.error?.code || "FORMAT_ERROR");
      }

      await dispatch(fetchMovies());
      return Number(data?.imported ?? 0);
    } catch (e) {
      const parsed = parseMoviesTxt(moviesText);
      let ok = 0;

      for (const m of parsed) {
        try {
          await dispatch(addMovie(m)).unwrap();
          ok++;
        } catch (e) {
          console.error(e);
        }
      }

      await dispatch(fetchMovies());

      return ok;
    }
  }
);

const moviesSlice = createSlice({
  name: MOVIES,
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<Query>) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load";
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((x, y) => x.title.localeCompare(y.title));
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export const { setQuery } = moviesSlice.actions;
export const moviesReducer = moviesSlice.reducer;
