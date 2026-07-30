import type { WebsiteContent } from "@/lib/website-api";
import { WeddingSiteView } from "@/components/wedding-site-view";

export function renderWebsiteTemplate(
  templateId: string,
  content: WebsiteContent,
  options?: { compact?: boolean; cardPreview?: boolean },
) {
  return (
    <WeddingSiteView
      templateId={templateId}
      content={content}
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
    <WeddingSiteView
      templateId="classic-white"
      content={content}
      compact={compact}
    />
  );
}
