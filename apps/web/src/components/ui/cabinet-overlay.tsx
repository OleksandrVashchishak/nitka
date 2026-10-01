"use client";

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type FormEventHandler,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { IconClose } from "@/components/icon-close";
import { IconButton } from "@/components/ui/icon-button";
import {
  OVERLAY_EXIT_MS,
  useOverlayPresence,
} from "@/hooks/use-overlay-presence";

export type CabinetOverlayVariant = "drawer" | "modal" | "confirm";
export type CabinetOverlayMobileVariant =
  | "fullscreen"
  | "sheet"
  | "drawer"
  | "center";
export type CabinetOverlayDesktopPresentation = "panel" | "centered";

export type CabinetOverlayProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  variant?: CabinetOverlayVariant;
  /** Desktop width — number = px, or any CSS length / min() */
  width?: number | string;
  mobileVariant?: CabinetOverlayMobileVariant;
  /** Budget-style: drawer stack but centered card on desktop */
  desktopPresentation?: CabinetOverlayDesktopPresentation;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  lockScroll?: boolean;
  /** Disable close actions (e.g. while saving/deleting) */
  closeDisabled?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  footer?: ReactNode;
  asForm?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  /** Extra class on the root overlay */
  className?: string;
  /** Extra class on the panel (legacy modifiers: cabinet-tasks-drawer, …) */
  panelClassName?: string;
  /** Extra class on the scrollable body / form (drawer) or body wrapper (modal) */
  bodyClassName?: string;
  /** Extra class on the actions row */
  footerClassName?: string;
  /** Aria label override when title is not a string */
  ariaLabel?: string;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function resolveWidth(
  variant: CabinetOverlayVariant,
  width?: number | string,
): string {
  if (width == null) {
    if (variant === "confirm") return "710px";
    if (variant === "drawer") return "420px";
    return "520px";
  }
  return typeof width === "number" ? `${width}px` : width;
}

function defaultMobileVariant(
  variant: CabinetOverlayVariant,
  mobileVariant?: CabinetOverlayMobileVariant,
): CabinetOverlayMobileVariant {
  if (mobileVariant) return mobileVariant;
  if (variant === "drawer") return "drawer";
  if (variant === "confirm") return "center";
  return "fullscreen";
}

export function CabinetOverlay({
  open,
  onClose,
  title,
  subtitle,
  variant = "drawer",
  width,
  mobileVariant,
  desktopPresentation = "panel",
  closeOnEscape = true,
  closeOnBackdrop = true,
  lockScroll = true,
  closeDisabled = false,
  initialFocusRef,
  footer,
  asForm = false,
  onSubmit,
  className,
  panelClassName,
  bodyClassName,
  footerClassName,
  ariaLabel,
  children,
}: CabinetOverlayProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const exitMs = OVERLAY_EXIT_MS[variant];
  const { mounted, visible } = useOverlayPresence(open, exitMs);
  const resolvedMobile = defaultMobileVariant(variant, mobileVariant);
  const widthValue = resolveWidth(variant, width);
  const label =
    ariaLabel ?? (typeof title === "string" ? title : "Діалог");

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    if (!lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, lockScroll]);

  useEffect(() => {
    if (!visible) return;
    if (!closeOnEscape) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !closeDisabled) {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, closeOnEscape, closeDisabled, onClose]);

  useEffect(() => {
    if (!visible) return;
    const panel = panelRef.current;
    if (!panel) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusTarget =
      initialFocusRef?.current ??
      closeBtnRef.current ??
      (panel.querySelector(FOCUSABLE) as HTMLElement | null);
    focusTarget?.focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", onKeyDown);
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = null;
    };
  }, [visible, initialFocusRef]);

  if (!mounted) return null;

  const rootOpenClass = visible ? " is-open" : "";
  const panelStyle = {
    ["--cabinet-overlay-width" as string]: widthValue,
  } as CSSProperties;

  const handleBackdrop = () => {
    if (!closeOnBackdrop || closeDisabled) return;
    onClose();
  };

  const footerEl = footer ? (
    <div
      className={
        footerClassName ??
        (variant === "drawer"
          ? "cabinet-drawer-actions"
          : variant === "confirm"
            ? "cabinet-confirm-modal__actions"
            : "cabinet-modal-actions")
      }
    >
      {footer}
    </div>
  ) : null;

  const subtitleEl = subtitle ? (
    typeof subtitle === "string" ? (
      <p>{subtitle}</p>
    ) : (
      subtitle
    )
  ) : null;

  let panel: ReactNode;

  if (variant === "drawer") {
    const drawerBodyClass = ["cabinet-drawer-form", bodyClassName]
      .filter(Boolean)
      .join(" ");
    const drawerPanelClass = ["cabinet-drawer", panelClassName]
      .filter(Boolean)
      .join(" ");

    const head = (
      <div className="cabinet-drawer-head">
        <h2 id={titleId}>{title}</h2>
        <IconButton
          ref={closeBtnRef}
          aria-label="Закрити"
          variant="close"
          icon={<IconClose />}
          onClick={onClose}
          disabled={closeDisabled}
        />
      </div>
    );

    const body = asForm ? (
      <form className={drawerBodyClass} onSubmit={onSubmit}>
        {children}
        {footerEl}
      </form>
    ) : (
      <div className={drawerBodyClass}>
        {children}
        {footerEl}
      </div>
    );

    panel = (
      <aside
        ref={panelRef as RefObject<HTMLElement | null>}
        className={drawerPanelClass}
        style={panelStyle}
        aria-labelledby={titleId}
      >
        {head}
        {body}
      </aside>
    );
  } else if (variant === "confirm") {
    const modalPanelClass = ["cabinet-modal", "cabinet-confirm-modal", panelClassName]
      .filter(Boolean)
      .join(" ");

    panel = (
      <div
        ref={panelRef as RefObject<HTMLDivElement | null>}
        className={modalPanelClass}
        style={panelStyle}
      >
        <div className="cabinet-confirm-modal__head">
          <h2 className="cabinet-confirm-modal__title" id={titleId}>
            {title}
          </h2>
          <IconButton
            ref={closeBtnRef}
            aria-label="Закрити"
            variant="close"
            size="m"
            icon={<IconClose />}
            onClick={onClose}
            disabled={closeDisabled}
          />
        </div>
        {children}
        {footerEl}
      </div>
    );
  } else {
    const modalPanelClass = ["cabinet-modal", panelClassName]
      .filter(Boolean)
      .join(" ");

    const head = (
      <div className="cabinet-modal-head">
        <div>
          <h2 id={titleId}>{title}</h2>
          {subtitleEl}
        </div>
        <IconButton
          ref={closeBtnRef}
          aria-label="Закрити"
          variant="close"
          size="m"
          icon={<IconClose />}
          onClick={onClose}
          disabled={closeDisabled}
        />
      </div>
    );

    const inner = (
      <>
        {head}
        {bodyClassName ? (
          <div className={bodyClassName}>{children}</div>
        ) : (
          children
        )}
        {footerEl}
      </>
    );

    if (asForm) {
      panel = (
        <form
          ref={panelRef as RefObject<HTMLFormElement | null>}
          className={modalPanelClass}
          style={panelStyle}
          onSubmit={onSubmit}
          aria-labelledby={titleId}
        >
          {inner}
        </form>
      );
    } else {
      panel = (
        <div
          ref={panelRef as RefObject<HTMLDivElement | null>}
          className={modalPanelClass}
          style={panelStyle}
          aria-labelledby={titleId}
        >
          {inner}
        </div>
      );
    }
  }

  const rootClass = [
    variant === "drawer" ? "cabinet-drawer-root" : "cabinet-modal-root",
    "cabinet-overlay-root",
    `cabinet-overlay-root--${variant}`,
    rootOpenClass.trim(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const backdropClass =
    variant === "drawer" ? "cabinet-drawer-backdrop" : "cabinet-modal-backdrop";

  const tree = (
    <div
      className={rootClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={label}
      data-mobile-variant={resolvedMobile}
      data-desktop-presentation={desktopPresentation}
      data-variant={variant}
    >
      <button
        type="button"
        className={backdropClass}
        aria-label="Закрити"
        onClick={handleBackdrop}
        disabled={closeDisabled || !closeOnBackdrop}
      />
      {panel}
    </div>
  );

  return createPortal(tree, document.body);
}
