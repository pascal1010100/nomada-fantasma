import { useCallback, useState } from "react";
import { CategoryKey } from "../constants";

export const useMapControls = () => {
  const [activeCats, setActiveCats] = useState<Set<CategoryKey>>(
    () => new Set()
  );

  const toggleCat = useCallback((key: CategoryKey) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return {
    activeCats,
    toggleCat,
  };
};
