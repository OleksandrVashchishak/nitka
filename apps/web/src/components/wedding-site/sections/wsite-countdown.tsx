"use client";

import { useEffect, useState } from "react";

type Props = {
  target: Date;
};

type Parts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function diffParts(target: Date): Parts {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return {
    days: String(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

export function WsiteCountdown({ target }: Props) {
  const [parts, setParts] = useState<Parts>(() => diffParts(target));

  useEffect(() => {
    setParts(diffParts(target));
    const id = window.setInterval(() => setParts(diffParts(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const items: Array<[string, string]> = [
    [parts.days, "днів"],
    [parts.hours, "годин"],
    [parts.minutes, "хвилин"],
    [parts.seconds, "секунд"],
  ];

  return (
    <section className="wsite-section wsite-section--soft wsite-countdown">
      <div className="wsite-section__inner">
        <p className="wsite-section__eyebrow">До весілля</p>
        <div className="wsite-countdown__grid">
          {items.map(([value, label]) => (
            <div key={label} className="wsite-countdown__item">
              <p className="wsite-countdown__value">{value}</p>
              <p className="wsite-countdown__label">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
