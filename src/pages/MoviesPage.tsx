import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/app/store";
import {
  addMovie,
  deleteMovie,
  fetchMovies,
  importMovies,
} from "@/entities/movie/model/slice";
import { SearchBar } from "@/features/search-movie/SearchBar";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { DEFAULT_DEBOUNCE_TIME } from "@/shared/constants";

const MoviesPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading, error } = useSelector((s: RootState) => s.movies);
  const [query, setQuery] = useState<{ title?: string; actor?: string }>({});

  const debouncedQuery = useDebounce(query, DEFAULT_DEBOUNCE_TIME);

  useEffect(() => {
    dispatch(fetchMovies(debouncedQuery));
  }, [debouncedQuery.title, debouncedQuery.actor, dispatch]);

  const onAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    const title = String(f.get("title") || "");
    const year = Number(f.get("year") || 0);
    const format = String(f.get("format") || "DVD");
    const actors = String(f.get("actors") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title || !year) return;

    await dispatch(addMovie({ title, year, format, actors }));

    e.currentTarget.reset();
  };

  const onImport = async (file?: File) => {
    if (!file) return;

    await dispatch(importMovies(file));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Movies</h1>

      <div className="card mb-4">
        <SearchBar onChange={setQuery} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Додати фільм</h3>
          <form className="flex flex-col gap-2" onSubmit={onAdd}>
            <input
              className="input"
              name="title"
              placeholder="Назва"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input"
                name="year"
                placeholder="Рік"
                type="number"
                min="1888"
                max="2021"
                required
              />
              <select className="input" name="format">
                <option>DVD</option>
                <option>VHS</option>
                <option>Blu-Ray</option>
              </select>
            </div>
            <input
              className="input"
              name="actors"
              placeholder="Актори (через кому)"
            />
            <button className="btn w-fit" type="submit">
              Додати
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Імпорт з файлу</h3>
          <input
            className="file:mr-4 file:btn"
            type="file"
            accept=".txt"
            onChange={(e) => onImport(e.target.files?.[0] || undefined)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Завантажте <code>sample_movies.txt</code> з умови.
          </p>
        </div>
      </div>

      {loading && <p className="text-gray-500">Завантаження…</p>}
      {error && <p className="text-red-600">Помилка: {error}</p>}

      <div className="overflow-x-auto card">
        <table className="min-w-full">
          <thead className="text-left">
            <tr className="border-b">
              <th className="py-2 pr-3">Назва</th>
              <th className="py-2 pr-3">Рік</th>
              <th className="py-2 pr-3">Формат</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ id, title, year, format, actors }) => (
              <tr key={id} className="border-b last:border-b-0">
                <td className="py-2 pr-3">{title}</td>
                <td className="py-2 pr-3">{year}</td>
                <td className="py-2 pr-3">{format}</td>
                <td className="py-2 text-right">
                  <button
                    className="btn-danger"
                    onClick={() => dispatch(deleteMovie(id))}
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoviesPage;
