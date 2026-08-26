import type { ReactNode } from "react";

export const cabTitle =
  "font-editorial italic text-[40px] leading-none text-[#1a1a1a] md:text-[48px]";
export const cabLead = "mt-3 max-w-xl text-[15px] leading-6 text-[#5c574e]";
export const cabCard =
  "rounded-[28px] bg-white shadow-sm ring-1 ring-black/5";
export const cabBtn =
  "inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60";
export const cabBtnGhost =
  "inline-flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm text-[#1a1a1a] shadow-sm ring-1 ring-black/5 transition hover:bg-[#f6f3ec] disabled:opacity-60";
export const cabBtnSage =
  "inline-flex items-center justify-center rounded-full bg-[#8a9a6b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7d8d60] disabled:opacity-60";
export const cabInput =
  "w-full rounded-2xl border-0 bg-[#f6f3ec] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none ring-1 ring-black/5 focus:ring-[#1a1a1a]/25";
export const cabKicker =
  "text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a877f]";

export function CoupleCabinetFrame({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="px-5 pb-12 pt-16 md:px-10 lg:pt-10">
      <div className={wide ? "mx-auto max-w-7xl" : "mx-auto max-w-6xl"}>
        {children}
      </div>
    </div>
  );
}

export function CabinetHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className={cabTitle}>{title}</h1>
        {description ? <div className={cabLead}>{description}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function CabinetEmpty({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={`${cabCard} mt-6 px-6 py-10`}>
      <p className="text-[15px] text-[#5c574e]">{children}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function CabinetStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <article className={`${cabCard} min-h-[120px] p-5`}>
      <p className="font-editorial text-[32px] italic leading-none text-[#1a1a1a]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#8a877f]">{label}</p>
    </article>
  );
}
