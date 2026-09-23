"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  title?: string;
  className?: string;
};

function styleKey(node: Element, index: number) {
  if (node instanceof HTMLLinkElement) {
    return `link:${node.href}`;
  }
  if (node instanceof HTMLStyleElement) {
    return `style:${index}:${node.textContent?.length ?? 0}:${node.textContent?.slice(0, 48) ?? ""}`;
  }
  return `node:${index}`;
}

function syncStyles(doc: Document) {
  const seen = new Set<string>();
  const existingByKey = new Map<string, Element>();

  doc.head.querySelectorAll("[data-we-preview-sync]").forEach((node) => {
    const key = node.getAttribute("data-we-preview-key");
    if (key) existingByKey.set(key, node);
  });

  document
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((node, index) => {
      const key = styleKey(node, index);
      seen.add(key);

      const existing = existingByKey.get(key);
      if (existing) {
        if (
          node instanceof HTMLStyleElement &&
          existing instanceof HTMLStyleElement &&
          existing.textContent !== node.textContent
        ) {
          existing.textContent = node.textContent;
        }
        return;
      }

      const clone = node.cloneNode(true) as HTMLElement;
      clone.setAttribute("data-we-preview-sync", "1");
      clone.setAttribute("data-we-preview-key", key);
      doc.head.appendChild(clone);
    });

  existingByKey.forEach((node, key) => {
    if (!seen.has(key)) node.remove();
  });

  doc.documentElement.className = document.documentElement.className;
  doc.body.className = document.body.className;
}

export function PreviewIframe({
  children,
  title = "Превʼю сайту",
  className,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: MutationObserver | null = null;
    let cancelled = false;
    let ready = false;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("a")) return;
      event.preventDefault();
    };

    const setup = () => {
      if (cancelled || ready) return;
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      ready = true;

      doc.body.replaceChildren();
      doc.documentElement.style.height = "100%";
      doc.body.style.margin = "0";
      doc.body.style.minHeight = "100%";
      doc.body.style.background = "#fff";

      syncStyles(doc);

      const root = doc.createElement("div");
      root.id = "we-preview-root";
      doc.body.appendChild(root);
      setMountNode(root);

      doc.addEventListener("click", onClick);

      observer = new MutationObserver(() => {
        syncStyles(doc);
      });
      observer.observe(document.head, { childList: true, subtree: true });
    };

    iframe.addEventListener("load", setup);
    if (iframe.contentDocument?.readyState === "complete") {
      setup();
    }

    return () => {
      cancelled = true;
      iframe.removeEventListener("load", setup);
      iframe.contentDocument?.removeEventListener("click", onClick);
      observer?.disconnect();
      setMountNode(null);
    };
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        className={className}
        src="about:blank"
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}
