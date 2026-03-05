import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCats = useMemo(
    () => parseCatsFromParams(searchParams),
    [searchParams]
  );

  const toggleCat = useCallback((key: CategoryKey) => {
    const next = new Set(activeCats);
    if (next.has(key)) next.delete(key);
    else next.add(key);

    const params = new URLSearchParams(searchParams.toString());
    const arr = setToSortedArray(next);
    if (arr.length === ALL_CATS.length) params.delete("cats");
    else params.set("cats", arr.join(","));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [activeCats, pathname, router, searchParams]);

  return {
    activeCats,
    toggleCat,
  };
};
