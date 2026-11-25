"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { IconHeart } from "@/components/icon-heart";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { TextInput } from "@/components/ui/text-input";
import { DESIGN_OPTIONS } from "@/components/website/editor/design-catalog";
import {
  IconChat,
  IconSparkle,
} from "@/components/website/editor/website-editor-icons";
import { useAuthStore } from "@/lib/auth-store";
import { submitContactMessage } from "@/lib/contact-api";
import { isCompleteUaPhone } from "@/lib/phone-mask";
import { getErrorMessage, toast } from "@/lib/toast";

type Props = {
  slug: string;
};

const FEATURES = [
  { icon: <IconSparkle />, text: "Дизайн з нуля, без шаблонів" },
  { icon: <IconHeart size={20} />, text: "Про вашу історію та стиль" },
  { icon: <IconChat />, text: "Особистий дизайнер на зв’язку" },
];

const COLLAGE = DESIGN_OPTIONS.filter((d) => d.id !== "botanical").slice(0, 3);

export function WebsiteEditorCustomDesign({ slug }: Props) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const canSubmit = name.trim().length > 0 && isCompleteUaPhone(phone);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || sending || !user) return;
    setSending(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: user.email,
        message: [
          "Заявка на індивідуальний дизайн сайту.",
          `Телефон: ${phone}`,
          slug ? `Сайт: ${slug}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
      toast.success("Заявку надіслано", "Ми передзвонимо найближчим часом");
      setPhone("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось надіслати заявку"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="we-custom">
      <form className="we-custom__panel" onSubmit={(e) => void onSubmit(e)}>
        <div className="we-custom__card">
          <div className="we-custom__collage" aria-hidden>
            {COLLAGE.map((d) => (
              <div key={d.id} className="we-custom__collage-item">
                <Image src={d.thumb} alt="" width={96} height={120} />
              </div>
            ))}
            <span className="we-custom__collage-star">✦</span>
          </div>

          <span className="we-custom__badge">Індивідуальний дизайн</span>
          <h2 className="we-custom__title">
            Хочете щось дуже оригінальне, стильне й особливе — саме про вас?
          </h2>
          <p className="we-custom__text">
            Ми створимо для вас ваше запрошення. Наш дизайнер розробить сайт з
            нуля: під вашу історію кохання, стиль весілля та улюблені кольори.
            Жодних шаблонів — тільки ви двоє.
          </p>

          <ul className="we-custom__features">
            {FEATURES.map((f) => (
              <li key={f.text} className="we-custom__feature">
                <span className="we-custom__feature-icon">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <div className="we-custom__form">
            <h3 className="we-custom__form-title">
              Залиште заявку — ми вам передзвонимо
            </h3>
            <p className="we-custom__form-text">
              Обговоримо ваші ідеї та деталі. Це ні до чого вас не зобов’язує.
            </p>
            <div className="we-custom__fields">
              <TextInput
                label="Ім’я*"
                size="m"
                value={name}
                placeholder="Як до вас звертатися"
                autoComplete="name"
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
              />
              <PhoneInput
                label="Номер телефону*"
                size="m"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          tone="accent"
          size="m"
          fullWidth
          className="we-custom__submit"
          disabled={!canSubmit}
          loading={sending}
          loadingText="Надсилаємо…"
        >
          Замовити дзвінок
        </Button>
      </form>
    </div>
  );
}
