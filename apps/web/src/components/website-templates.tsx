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
