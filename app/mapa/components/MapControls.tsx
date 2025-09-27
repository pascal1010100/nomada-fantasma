import { Plus, Minus, Crosshair, RotateCcw } from "lucide-react";

interface MapControlButtonProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const MapControlButton = ({ label, Icon, onClick }: MapControlButtonProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="
      h-10 w-10 rounded-full
      bg-[color:var(--card,rgba(17,24,39,0.7))]
      border border-[color:var(--border,#334155)]
      backdrop-blur shadow-md
      hover:scale-[1.03] active:scale-95 transition-transform
      ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
      text-slate-100/90
    "
    title={label}
  >
    <Icon className="h-5 w-5 mx-auto" />
  </button>
);

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onRecenter: () => void;
}

export const MapControls = ({
  onZoomIn,
  onZoomOut,
  onLocate,
  onRecenter,
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
    ].map((props) => (
      <MapControlButton key={props.label} {...props} />
    ))}
  </div>
);
