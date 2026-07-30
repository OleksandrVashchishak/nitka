import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

type Block = {
  type?: string;
  data?: {
    text?: string;
    level?: number;
    items?: Array<string | { content?: string; text?: string }>;
    caption?: string;
    file?: { url?: string };
    url?: string;
    stretched?: boolean;
    withBorder?: boolean;
    withBackground?: boolean;
  };
};

export function ContentBody({ body }: { body: unknown }) {
  const blocks = extractBlocks(body);
  if (!blocks.length) {
    return (
      <Text style={styles.muted}>Повний текст поки лише на сайті.</Text>
    );
  }

  return (
    <View style={styles.wrap}>
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        if (b.type === "header") {
          return (
            <Text key={key} style={styles.h}>
              {stripHtml(b.data?.text ?? "")}
            </Text>
          );
        }
        if (b.type === "list") {
          const items = b.data?.items ?? [];
          return (
            <View key={key} style={styles.list}>
              {items.map((item, j) => (
                <Text key={j} style={styles.p}>
                  •{" "}
                  {stripHtml(
                    typeof item === "string"
                      ? item
                      : item.content || item.text || "",
                  )}
                </Text>
              ))}
            </View>
          );
        }
        if (b.type === "quote") {
          return (
            <Text key={key} style={styles.quote}>
              "{stripHtml(b.data?.text ?? "")}"
            </Text>
          );
        }
        if (b.type === "delimiter") {
          return (
            <Text key={key} style={styles.delim}>
              · · ·
            </Text>
          );
        }
        if (b.type === "image") {
          const url = b.data?.file?.url || b.data?.url;
          if (!url) return null;
          return (
            <View key={key} style={styles.imgWrap}>
              <Image
                source={{ uri: url }}
                style={[
                  styles.img,
                  b.data?.stretched && styles.imgStretched,
                  b.data?.withBorder && styles.imgBorder,
                  b.data?.withBackground && styles.imgBg,
                ]}
                resizeMode="cover"
              />
              {b.data?.caption ? (
                <Text style={styles.caption}>
                  {stripHtml(b.data.caption)}
                </Text>
              ) : null}
            </View>
          );
        }
        const text = stripHtml(b.data?.text ?? b.data?.caption ?? "");
        if (!text) return null;
        return (
          <Text key={key} style={styles.p}>
            {text}
          </Text>
        );
      })}
    </View>
  );
}

function extractBlocks(body: unknown): Block[] {
  if (!body || typeof body !== "object") return [];
  const maybe = body as { blocks?: Block[] };
  return Array.isArray(maybe.blocks) ? maybe.blocks : [];
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

const styles = StyleSheet.create({
  wrap: { gap: 10, marginTop: 8 },
  h: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 8,
  },
  p: { fontSize: 15, lineHeight: 22, color: colors.ink },
  quote: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    color: colors.inkSoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
  },
  list: { gap: 4 },
  delim: { textAlign: "center", color: colors.primarySoft, marginVertical: 8 },
  muted: { color: colors.inkSoft, marginTop: 8 },
  imgWrap: { marginVertical: 4 },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    backgroundColor: colors.blush,
  },
  imgStretched: { height: 240 },
  imgBorder: { borderWidth: 1, borderColor: colors.line },
  imgBg: { backgroundColor: colors.blush, padding: 4 },
  caption: {
    marginTop: 6,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
  },
});
