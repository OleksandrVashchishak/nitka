import type { EditorJsBody } from "@/lib/content-api";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Дозволяє базові inline-теги EditorJS (b/i/a), решту ескейпить. */
function sanitizeInline(html: string) {
  const withMarkers = html
    .replace(/<b>/gi, "{{B}}")
    .replace(/<\/b>/gi, "{{/B}}")
    .replace(/<i>/gi, "{{I}}")
    .replace(/<\/i>/gi, "{{/I}}")
    .replace(/<a href="([^"]*)">/gi, '{{A:$1}}')
    .replace(/<\/a>/gi, "{{/A}}");
  const escaped = escapeHtml(withMarkers);
  return escaped
    .replace(/\{\{B\}\}/g, "<strong>")
    .replace(/\{\{\/B\}\}/g, "</strong>")
    .replace(/\{\{I\}\}/g, "<em>")
    .replace(/\{\{\/I\}\}/g, "</em>")
    .replace(/\{\{A:([^}]*)\}\}/g, (_m, href: string) => {
      const safe = href.startsWith("http") || href.startsWith("/")
        ? href
        : "#";
      return `<a href="${escapeHtml(safe)}" class="text-sage-deep underline underline-offset-2">`;
    })
    .replace(/\{\{\/A\}\}/g, "</a>");
}

export function renderEditorJsHtml(body: EditorJsBody | null | undefined) {
  const blocks = body?.blocks ?? [];
  if (!blocks.length) return "";

  return blocks
    .map((block) => {
      const data = block.data ?? {};
      switch (block.type) {
        case "header": {
          const level = Math.min(4, Math.max(2, Number(data.level) || 2));
          const text = sanitizeInline(String(data.text ?? ""));
          const cls =
            level === 2
              ? "mt-10 font-[family-name:var(--font-display)] text-3xl text-ink"
              : level === 3
                ? "mt-8 font-[family-name:var(--font-display)] text-2xl text-ink"
                : "mt-6 text-xl font-semibold text-ink";
          return `<h${level} class="${cls}">${text}</h${level}>`;
        }
        case "paragraph": {
          const text = sanitizeInline(String(data.text ?? ""));
          if (!text.trim()) return "";
          return `<p class="mt-4 text-base leading-7 text-ink-soft">${text}</p>`;
        }
        case "list": {
          const style = data.style === "ordered" ? "ol" : "ul";
          const items = Array.isArray(data.items) ? data.items : [];
          const lis = items
            .map((item) => {
              const text =
                typeof item === "string"
                  ? item
                  : String((item as { content?: string })?.content ?? "");
              return `<li class="mt-1">${sanitizeInline(text)}</li>`;
            })
            .join("");
          const listCls =
            style === "ol"
              ? "mt-4 list-decimal space-y-1 pl-5 text-ink-soft"
              : "mt-4 list-disc space-y-1 pl-5 text-ink-soft";
          return `<${style} class="${listCls}">${lis}</${style}>`;
        }
        case "quote": {
          const text = sanitizeInline(String(data.text ?? ""));
          const caption = sanitizeInline(String(data.caption ?? ""));
          return `<blockquote class="mt-6 border-l-2 border-sage pl-5 text-lg italic text-ink"><p>${text}</p>${
            caption
              ? `<cite class="mt-2 block text-sm not-italic text-ink-soft">${caption}</cite>`
              : ""
          }</blockquote>`;
        }
        case "delimiter":
          return `<hr class="my-10 border-line" />`;
        case "image": {
          const file = data.file as { url?: string } | undefined;
          const url = file?.url || String(data.url ?? "");
          if (!url) return "";
          const caption = sanitizeInline(String(data.caption ?? ""));
          return `<figure class="mt-8"><img src="${escapeHtml(url)}" alt="${caption || ""}" class="w-full rounded-2xl object-cover" loading="lazy" />${
            caption
              ? `<figcaption class="mt-2 text-center text-sm text-ink-soft">${caption}</figcaption>`
              : ""
          }</figure>`;
        }
        case "embed": {
          const embed = String(data.embed ?? "");
          const service = String(data.service ?? "");
          if ((service === "youtube" || service === "vimeo") && embed) {
            return `<div class="mt-8 aspect-video overflow-hidden rounded-2xl bg-mist"><iframe src="${escapeHtml(embed)}" class="h-full w-full" title="Відео" allowfullscreen loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`;
          }
          const source = String(data.source ?? "");
          if (source) {
            return `<p class="mt-4"><a href="${escapeHtml(source)}" class="text-sage-deep underline" rel="noopener noreferrer" target="_blank">${escapeHtml(source)}</a></p>`;
          }
          return "";
        }
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}
