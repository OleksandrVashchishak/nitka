import { Image, StyleSheet, Text, View } from "react-native";
import type { InvitationContent } from "@/lib/invitations-api";
import { getInvitationTheme } from "@/lib/invitation-themes";

type Props = {
  templateId: string;
  content: InvitationContent;
  guestName?: string;
  compact?: boolean;
};

function Meta({
  label,
  value,
  muted,
  text,
}: {
  label: string;
  value: string;
  muted: string;
  text: string;
}) {
  if (!value.trim()) return null;
  return (
    <View style={styles.meta}>
      <Text style={[styles.metaLabel, { color: muted }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: text }]}>{value}</Text>
    </View>
  );
}

export function InvitationCard({
  templateId,
  content,
  guestName,
  compact = false,
}: Props) {
  const theme = getInvitationTheme(templateId);
  const c = theme.colors;
  const pad = compact ? 20 : 28;

  return (
    <View style={[styles.wrap, { backgroundColor: c.bg }]}>
      {theme.frame !== "none" ? (
        <View
          pointerEvents="none"
          style={[
            styles.frame,
            theme.frame === "double"
              ? { top: 10, right: 10, bottom: 10, left: 10, borderWidth: 2 }
              : { top: 14, right: 14, bottom: 14, left: 14, borderWidth: 1 },
            { borderColor: c.line },
          ]}
        />
      ) : null}

      <View style={{ padding: pad }}>
        {content.coverImageUrl ? (
          <Image
            source={{ uri: content.coverImageUrl }}
            style={[
              styles.cover,
              compact ? { maxWidth: 160, height: 120 } : { maxWidth: 220, height: 160 },
            ]}
          />
        ) : null}

        <Text style={[styles.opener, { color: c.accent }]}>{content.opener}</Text>
        <Text style={[styles.headline, { color: c.text }]}>{content.headline}</Text>

        {guestName ? (
          <Text style={[styles.forGuest, { color: c.muted }]}>
            Для <Text style={{ color: c.text, fontWeight: "600" }}>{guestName}</Text>
          </Text>
        ) : null}

        {content.body.trim() ? (
          <Text style={[styles.body, { color: c.muted }]}>{content.body}</Text>
        ) : null}

        <View style={styles.metaGrid}>
          <Meta label="Дата" value={content.dateLabel} muted={c.muted} text={c.text} />
          <Meta label="Час" value={content.timeLabel} muted={c.muted} text={c.text} />
          <Meta label="Місце" value={content.venue} muted={c.muted} text={c.text} />
          <Meta label="Адреса" value={content.address} muted={c.muted} text={c.text} />
          <Meta label="Дрес-код" value={content.dressCode} muted={c.muted} text={c.text} />
        </View>

        {content.rsvpNote.trim() ? (
          <Text style={[styles.rsvpNote, { color: c.muted }]}>{content.rsvpNote}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  frame: {
    position: "absolute",
  },
  cover: {
    alignSelf: "center",
    width: "100%",
    borderRadius: 2,
    marginBottom: 16,
  },
  opener: {
    textAlign: "center",
    fontSize: 18,
    fontStyle: "italic",
  },
  headline: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  forGuest: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
  },
  body: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
  },
  metaGrid: {
    marginTop: 22,
    gap: 14,
  },
  meta: {
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  metaValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  rsvpNote: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
  },
});
