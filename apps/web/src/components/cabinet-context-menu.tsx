"use client";

import {
  forwardRef,
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type MenuProps = {
  children: ReactNode;
  className?: string;
};

const VIEWPORT_GAP = 8;
const ANCHOR_GAP = 6;

/** Shared cabinet row context menu (guests / budget / checklist / …). */
export function CabinetContextMenu({ children, className }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the menu inside the visible viewport: flip up, slide up, shift sideways, or scroll.
  useLayoutEffect(() => {
    const el = ref.current;
    const anchor = el?.parentElement;
    if (!el || !anchor) return;

    function place() {
      if (!el || !anchor) return;
      for (const prop of [
        "top",
        "bottom",
        "maxHeight",
        "overflowY",
        "transform",
      ] as const) {
        el.style[prop] = "";
      }

      const nav = document.querySelector<HTMLElement>(".cabinet-bottom-nav");
      const navTop =
        nav && nav.offsetParent !== null
          ? nav.getBoundingClientRect().top
          : window.innerHeight;
      const limitBottom = Math.min(window.innerHeight, navTop) - VIEWPORT_GAP;
      const limitTop = VIEWPORT_GAP;

      const a = anchor.getBoundingClientRect();
      const height = el.offsetHeight;
      const spaceBelow = limitBottom - (a.bottom + ANCHOR_GAP);
      const spaceAbove = a.top - ANCHOR_GAP - limitTop;

      let shiftY = 0;
      if (height > spaceBelow) {
        if (height <= spaceAbove) {
          el.style.top = "auto";
          el.style.bottom = `calc(100% + ${ANCHOR_GAP}px)`;
        } else {
          // Fits neither side: slide up over the trigger so the whole menu is visible.
          const total = limitBottom - limitTop;
          let nextHeight = height;
          if (height > total) {
            nextHeight = total;
            el.style.maxHeight = `${total}px`;
            el.style.overflowY = "auto";
          }
          const naturalTop = a.bottom + ANCHOR_GAP;
          shiftY = Math.max(limitTop, limitBottom - nextHeight) - naturalTop;
        }
      }

      const r = el.getBoundingClientRect();
      const maxRight = window.innerWidth - VIEWPORT_GAP;
      let shiftX = 0;
      if (r.left < VIEWPORT_GAP) {
        shiftX = VIEWPORT_GAP - r.left;
      } else if (r.right > maxRight) {
        shiftX = maxRight - r.right;
      }
      if (shiftX || shiftY) {
        el.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
      }
    }

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  return (
    <div
      ref={ref}
      className={`cabinet-ctx-menu${className ? ` ${className}` : ""}`}
      role="menu"
    >
      {children}
    </div>
  );
}

type ActionItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  active?: boolean;
};

/** Text action row (icon + label), optional danger styling. */
export function CabinetActionItem({
  children,
  icon,
  danger,
  active,
  className,
  type = "button",
  ...rest
}: ActionItemProps) {
  const classes = [
    "cabinet-action-item",
    danger ? "is-danger" : null,
    active ? "is-active" : null,
    className || null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function CabinetContextMenuItem({
  className,
  ...rest
}: ActionItemProps) {
  const classes = [
    "cabinet-ctx-menu-item",
    className || null,
  ]
    .filter(Boolean)
    .join(" ");

  return <CabinetActionItem className={classes} {...rest} role="menuitem" />;
}

export function CabinetContextMenuDivider() {
  return <div className="cabinet-ctx-menu-divider" />;
}

type LabelProps = {
  children: ReactNode;
  className?: string;
};

export function CabinetContextMenuLabel({ children, className }: LabelProps) {
  return (
    <p
      className={`cabinet-ctx-menu-label${className ? ` ${className}` : ""}`}
    >
      {children}
    </p>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  className?: string;
};

/** Inline text field inside a context menu (e.g. custom assignee). */
export const CabinetContextMenuInput = forwardRef<
  HTMLInputElement,
  InputProps
>(function CabinetContextMenuInput({ className, ...rest }, ref) {
  const classes = [
    "cabinet-ctx-menu-input",
    className || null,
  ]
    .filter(Boolean)
    .join(" ");

  return <input ref={ref} type="text" className={classes} {...rest} />;
});
