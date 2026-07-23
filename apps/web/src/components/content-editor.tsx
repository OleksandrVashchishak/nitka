"use client";

import { useEffect, useRef } from "react";
import type { EditorJsBody } from "@/lib/content-api";
import { uploadFile } from "@/lib/client-api";

type Props = {
  initial?: EditorJsBody | null;
  onReady?: (getData: () => Promise<EditorJsBody>) => void;
};

type EditorInstance = {
  isReady: Promise<void>;
  save: () => Promise<EditorJsBody>;
  destroy: () => void | Promise<void>;
};

export function ContentEditor({ initial, onReady }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!holderRef.current || editorRef.current) return;

      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const ImageTool = (await import("@editorjs/image")).default;

      if (cancelled || !holderRef.current) return;

      const initialData = {
        time: initial?.time ?? Date.now(),
        blocks: initial?.blocks?.length
          ? initial.blocks
          : [{ type: "paragraph", data: { text: "" } }],
        version: initial?.version ?? "2.30.0",
      };

      const editor = new EditorJS({
        holder: holderRef.current,
        placeholder: "Почни писати… Додай заголовки, списки, фото, відео.",
        // EditorJS OutputData typing is stricter than our CMS JSON
        data: initialData as never,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: { levels: [2, 3, 4], defaultLevel: 2 },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const uploaded = await uploadFile(file);
                  return {
                    success: 1,
                    file: { url: uploaded.url },
                  };
                },
              },
            },
          },
        },
      }) as unknown as EditorInstance;

      await editor.isReady;
      if (cancelled) {
        await Promise.resolve(editor.destroy());
        return;
      }

      editorRef.current = editor;
      onReady?.(async () => (await editor.save()) as EditorJsBody);
    }

    void init();

    return () => {
      cancelled = true;
      const ed = editorRef.current;
      editorRef.current = null;
      if (ed) void Promise.resolve(ed.destroy());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once per editor instance
  }, []);

  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-3 md:px-6">
      <div ref={holderRef} className="prose-editor min-h-[320px]" />
    </div>
  );
}
