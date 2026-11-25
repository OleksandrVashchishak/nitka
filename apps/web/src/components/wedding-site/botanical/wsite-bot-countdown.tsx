"use client";

import { useEffect, useState } from "react";
import { BotanicalOrnament } from "@/components/wedding-site/botanical/botanical-ornament";
import {
  diffParts,
  type CountdownParts,
} from "@/components/wedding-site/sections/wsite-countdown";

type Props = {
  target: Date;
};

export function WsiteBotCountdown({ target }: Props) {
  const [parts, setParts] = useState<CountdownParts>(() => diffParts(target));

  useEffect(() => {
    setParts(diffParts(target));
    const id = window.setInterval(() => setParts(diffParts(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const items: Array<[string, string]> = [
    [parts.days, "днів"],
    [parts.hours, "годин"],
    [parts.minutes, "хвилини"],
    [parts.seconds, "секунд"],
  ];

  return (
    <section className="wsite-bot-countdown">
      <BotanicalOrnament
        name="lily"
        className="wsite-bot-countdown__bg wsite-bot-countdown__bg--right"
      />
      <BotanicalOrnament
        name="lily"
        className="wsite-bot-countdown__bg wsite-bot-countdown__bg--left"
      />
      <BotanicalOrnament name="emblem" className="wsite-bot-countdown__emblem" />
      <h2 className="wsite-bot-countdown__title">До нашого дня</h2>
      <div className="wsite-bot-countdown__grid">
        {items.map(([value, label]) => (
          <div key={label} className="wsite-bot-countdown__unit">
            <p className="wsite-bot-countdown__value">{value}</p>
            <p className="wsite-bot-countdown__label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
