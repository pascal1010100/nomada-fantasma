import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryKey, CATEGORIES } from "../constants";

const ALL_CATS = CATEGORIES.map((c) => c.key);

type SearchParamsLike = { get(name: string): string | null };

const parseCatsFromParams = (sp: SearchParamsLike) => {
  const v = sp.get("cats");
  if (v == null) return new Set<CategoryKey>(ALL_CATS); // default: all
  if (v.trim() === "") return new Set<CategoryKey>();   // empty
  const raw = v.split(",").map((s) => s.trim());
  const valid = raw.filter((k): k is CategoryKey => (ALL_CATS as string[]).includes(k));
  return new Set<CategoryKey>(valid);
};

const setToSortedArray = (s: Set<CategoryKey>) => ALL_CATS.filter((k) => s.has(k));

export const useMapControls = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL
  const [activeCats, setActiveCats] = useState<Set<CategoryKey>>(() => {
    if (typeof window === "undefined") return new Set(ALL_CATS);
    return parseCatsFromParams(new URLSearchParams(window.location.search));
  });

  // Sync URL -> State (navigation)
  useEffect(() => {
    const next = parseCatsFromParams(searchParams);
    const same =
      next.size === activeCats.size &&
      setToSortedArray(next).every((k, i) => k === setToSortedArray(activeCats)[i]);
    if (!same) setActiveCats(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Sync State -> URL
  useEffect(() => {
    const current = parseCatsFromParams(searchParams);
    const same =
      current.size === activeCats.size &&
      setToSortedArray(current).every((k, i) => k === setToSortedArray(activeCats)[i]);
    if (same) return;

    const params = new URLSearchParams(searchParams.toString());
    const arr = setToSortedArray(activeCats);
    if (arr.length === ALL_CATS.length) params.delete("cats");
    else params.set("cats", arr.join(","));

    const pathname = typeof window !== "undefined" ? window.location.pathname : "/mapa";
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [activeCats, router, searchParams]);

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
