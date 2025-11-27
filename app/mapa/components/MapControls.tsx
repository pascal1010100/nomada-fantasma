import { Plus, Minus, Crosshair, RotateCcw, Ghost } from "lucide-react";

interface MapControlButtonProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  active?: boolean;
}

const MapControlButton = ({ label, Icon, onClick, active }: MapControlButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`
      h-10 w-10 rounded-full
      border backdrop-blur shadow-md
      hover:scale-[1.03] active:scale-95 transition-all
      ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
      flex items-center justify-center
      ${active
        ? "bg-purple-600/90 border-purple-400 text-white shadow-purple-500/20"
        : "bg-[color:var(--card,rgba(17,24,39,0.7))] border-[color:var(--border,#334155)] text-slate-100/90"
      }
    `}
    title={label}
  >
    <Icon className={`h-5 w-5 ${active ? "animate-pulse" : ""}`} />
  </button>
);

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onRecenter: () => void;
  onToggleGhost: () => void;
  isGhostMode: boolean;
}

export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  onRecenter,
  onToggleGhost,
  isGhostMode,
}: MapControlsProps) => (
  <div
    className="
      absolute z-[30] flex flex-col gap-2
      left-[calc(env(safe-area-inset-left)+14px)]
      top-[calc(env(safe-area-inset-top)+14px)]
    "
  >
    {[
      { label: "Acercar", Icon: Plus, onClick: onZoomIn },
      { label: "Alejar", Icon: Minus, onClick: onZoomOut },
      { label: "Mi ubicación", Icon: Crosshair, onClick: onLocate },
      { label: "Volver al inicio", Icon: RotateCcw, onClick: onRecenter },
      { label: "Modo Fantasma", Icon: Ghost, onClick: onToggleGhost, active: isGhostMode },
    ].map((props) => (
      <MapControlButton key={props.label} {...props} />
    ))}
  </div>
);
