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
                ? "border-primary/40 bg-primary/15 text-primary dark:bg-white/10 dark:border-white/30 dark:text-white"
                : isUnavailable
                  ? "border-border bg-card/70 text-muted-foreground"
                  : "border-border bg-card/90 text-foreground/80",
              (isUnavailable && !active)
                ? "cursor-not-allowed border-dashed text-foreground/65 dark:text-slate-300/80"
                : "hover:scale-[1.02] active:scale-95",
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
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
