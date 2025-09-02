import { useEffect, useState } from "react";

import { DEFAULT_DEBOUNCE_TIME } from "../constants";

export const useDebounce = <T>(value: T, delay = DEFAULT_DEBOUNCE_TIME): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};
