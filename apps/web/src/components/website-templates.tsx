import type { WebsiteContent } from "@/lib/website-api";
import { WeddingSite } from "@/components/wedding-site/WeddingSite";

export function renderWebsiteTemplate(
  templateId: string,
  content: WebsiteContent,
  options?: {
    compact?: boolean;
    cardPreview?: boolean;
    weddingDate?: string | null;
  },
) {
  return (
    <WeddingSite
      templateId={templateId}
      content={content}
      weddingDate={options?.weddingDate}
      compact={options?.compact}
      cardPreview={options?.cardPreview}
    />
  );
}

/** @deprecated use renderWebsiteTemplate */
export function ClassicWeddingTemplate({
  content,
  compact,
}: {
  content: WebsiteContent;
  compact?: boolean;
}) {
  return (
    <WeddingSite templateId="classic-white" content={content} compact={compact} />
  );
}
