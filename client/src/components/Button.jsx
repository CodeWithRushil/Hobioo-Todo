const variants = {
  primary:
    "bg-white text-black shadow-lg shadow-[var(--color-accent-glow)] hover:bg-[var(--color-accent-hover)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-neutral-500 hover:text-white hover:bg-[var(--color-surface-hover)]",
  danger:
    "bg-transparent text-neutral-500 hover:text-white hover:bg-white/10",
  subtle:
    "bg-[var(--color-surface-hover)] text-neutral-300 border border-[var(--color-border)] hover:border-neutral-500 hover:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-sm rounded-xl",
  icon: "p-2 rounded-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:opacity-40 disabled:pointer-events-none",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
