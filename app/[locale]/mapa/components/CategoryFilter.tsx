import { CATEGORIES, CategoryKey } from "../constants";
import { useTranslations } from "next-intl";
import { buttonClassNames } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

interface CategoryFilterProps {
  activeCats: Set<CategoryKey>;
  onToggleCategory: (key: CategoryKey) => void;
  categoryCounts?: Partial<Record<CategoryKey, number>>;
}

export const CategoryFilter = ({
  activeCats,
  onToggleCategory,
  categoryCounts = {},
}: CategoryFilterProps) => {
  const t = useTranslations('Map');
  return (
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
        const count = categoryCounts[key] ?? 0;
        const isUnavailable = count === 0;
        let localizedLabel: string = label;
        try {
          localizedLabel = t(`categories.${key}`);
        } catch {
          localizedLabel = label;
        }
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggleCategory(key)}
            disabled={isUnavailable && !active}
            aria-pressed={active}
            className={cn(
              buttonClassNames("ghost", "sm"),
              "group rounded-full px-3 py-1.5 text-xs transition-all backdrop-blur border",
              active
                ? "bg-white/10 dark:bg-white/10 border-white/30 text-white"
                : isUnavailable
                  ? "bg-[color:var(--card,rgba(17,24,39,0.35))] border-[color:var(--border,#334155)] text-slate-400/60"
                  : "bg-[color:var(--card,rgba(17,24,39,0.55))] border-[color:var(--border,#334155)] text-slate-200/80",
              (isUnavailable && !active) ? "cursor-not-allowed opacity-60" : "hover:scale-[1.02] active:scale-95",
              "focus-visible:ring-cyan-400/60"
            )}
            title={`${localizedLabel} (${count})`}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: active ? color : isUnavailable ? "#475569" : "#64748B" }}
            />
            <Icon className="h-3.5 w-3.5 opacity-90" />
            <span className="opacity-90">{localizedLabel}</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.5 text-[10px] leading-none">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
