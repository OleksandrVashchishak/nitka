"use client";

import { renderWebsiteTemplate } from "@/components/website-templates";
import { PreviewIframe } from "@/components/website/editor/preview-iframe";
import {
  IconDesktop,
  IconMobile,
} from "@/components/website/editor/website-editor-icons";
import type { WebsiteContent } from "@/lib/website-api";

export type PreviewMode = "desktop" | "mobile";

type Props = {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  templateId: string;
  content: WebsiteContent;
  displayUrl: string;
  weddingDate?: string | null;
};

export function WebsiteEditorPreview({
  mode,
  onModeChange,
  templateId,
  content,
  displayUrl,
  weddingDate,
}: Props) {
  return (
    <section className="we-preview" aria-label="Превʼю сайту">
      <div className="we-preview__toolbar">
        <div className="we-preview__toggle" role="group" aria-label="Пристрій">
          <button
            type="button"
            className={`we-preview__toggle-btn${
              mode === "desktop" ? " we-preview__toggle-btn--active" : ""
            }`}
            onClick={() => onModeChange("desktop")}
          >
            <IconDesktop />
            Десктоп
          </button>
          <button
            type="button"
            className={`we-preview__toggle-btn${
              mode === "mobile" ? " we-preview__toggle-btn--active" : ""
            }`}
            onClick={() => onModeChange("mobile")}
          >
            <IconMobile />
            Мобільний
          </button>
        </div>
      </div>

      <div className="we-preview__stage">
        <div
          className={`we-preview__browser${
            mode === "mobile" ? " we-preview__browser--mobile" : ""
          }`}
        >
          <div className="we-preview__chrome">
            <div className="we-preview__dots" aria-hidden>
              <span className="we-preview__dot we-preview__dot--red" />
              <span className="we-preview__dot we-preview__dot--yellow" />
              <span className="we-preview__dot we-preview__dot--green" />
            </div>
            <div className="we-preview__url">{displayUrl}</div>
          </div>
          <div className="we-preview__frame">
            <PreviewIframe className="we-preview__iframe">
              {renderWebsiteTemplate(templateId, content, { weddingDate })}
            </PreviewIframe>
          </div>
        </div>
      </div>
    </section>
  );
}
