import { CATEGORIES, CategoryKey } from "../constants";

interface CategoryFilterProps {
  activeCats: Set<CategoryKey>;
  onToggleCategory: (key: CategoryKey) => void;
}

export const CategoryFilter = ({
  activeCats,
  onToggleCategory,
}: CategoryFilterProps) => (
  <div
    className="
      absolute z-[30] right-[calc(env(safe-area-inset-right)+14px)]
      top-[calc(env(safe-area-inset-top)+14px)]
      flex items-center gap-2 flex-wrap
      max-w-[72vw]
    "
  >
    {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
      const active = activeCats.has(key);
      return (
        <button
          key={key}
          type="button"
          onClick={() => onToggleCategory(key)}
          className={`
            group flex items-center gap-1 rounded-full px-3 py-1.5 text-xs
            transition-all backdrop-blur border
            ${
              active
                ? "bg-white/10 dark:bg-white/10 border-white/30 text-white"
                : "bg-[color:var(--card,rgba(17,24,39,0.55))] border-[color:var(--border,#334155)] text-slate-200/80"
            }
            hover:scale-[1.02] active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
          `}
          title={label}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: active ? color : "#64748B" }}
          />
          <Icon className="h-3.5 w-3.5 opacity-90" />
          <span className="opacity-90">{label}</span>
        </button>
      );
    })}
  </div>
);
