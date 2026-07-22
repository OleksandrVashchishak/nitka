type LoaderProps = {
  label?: string;
  className?: string;
};

export function Spinner({ className = "size-10" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <span className="absolute inset-0 rounded-full border-2 border-sage/15" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sage border-r-sage/40" />
      <span className="absolute inset-[22%] animate-loader-pulse rounded-full bg-sage/20" />
    </div>
  );
}

export function PageLoader({
  label = "Завантаження…",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center gap-5 py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="absolute -inset-6 animate-loader-ring rounded-full border border-sage/20" />
        <Spinner className="size-12" />
      </div>
      <div className="text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-ink">
          NITKA
        </p>
        <p className="mt-2 text-sm text-ink-soft">{label}</p>
      </div>
      <div className="flex gap-1.5">
        <span className="size-1.5 animate-loader-dot rounded-full bg-sage [animation-delay:0ms]" />
        <span className="size-1.5 animate-loader-dot rounded-full bg-sage [animation-delay:160ms]" />
        <span className="size-1.5 animate-loader-dot rounded-full bg-sage [animation-delay:320ms]" />
      </div>
    </div>
  );
}

export function InlineLoader({
  label = "Завантаження…",
  className = "",
}: LoaderProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-8 ${className}`}
      role="status"
    >
      <Spinner className="size-7" />
      <span className="text-sm text-ink-soft">{label}</span>
    </div>
  );
}

export function ButtonSpinner({ className = "size-4" }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current/25 border-t-current ${className}`}
      aria-hidden
    />
  );
}

export function LoadingButtonLabel({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}) {
  if (!loading) return children;
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <ButtonSpinner />
      {loadingText ?? children}
    </span>
  );
}
