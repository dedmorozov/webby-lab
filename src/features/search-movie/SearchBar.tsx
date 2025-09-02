import { useState } from "react";

type SearchBarProps = {
  onChange: (value: { title?: string; actor?: string }) => void;
};

export const SearchBar = ({ onChange }: SearchBarProps) => {
  const [title, setTitle] = useState("");
  const [actor, setActor] = useState("");

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        className="input w-full"
        placeholder="Пошук за назвою"
        value={title}
        onChange={(e) => {
          const { value } = e.target;

          setTitle(value);
          onChange({ title: value, actor });
        }}
      />
      <input
        // TODO: fix
        disabled
        className="input w-full"
        placeholder="Пошук за актором"
        value={actor}
        onChange={(e) => {
          const { value } = e.target;

          setActor(value);
          onChange({ title, actor: value });
        }}
      />
    </div>
  );
};
