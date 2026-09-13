import { initialsOf } from "@/lib/utils";

export default function Avatar({
  name,
  color,
  size = 40,
  className = "",
}: {
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: size * 0.38,
        boxShadow: `0 4px 14px -4px ${color}99`,
      }}
    >
      {initialsOf(name)}
    </span>
  );
}