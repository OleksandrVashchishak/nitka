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

function SparkIcon() {
  return (
    <svg
      className="wsite-countdown__spark-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 0.5L10.2 7.8L17.5 9L10.2 10.2L9 17.5L7.8 10.2L0.5 9L7.8 7.8L9 0.5Z"
        fill="currentColor"
      />
    </svg>
  );
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
    [parts.minutes, "хвилини"],
    [parts.seconds, "секунд"],
  ];

  return (
    <section className="wsite-countdown">
      <div className="wsite-countdown__inner">
        <div className="wsite-countdown__spark" aria-hidden>
          <SparkIcon />
        </div>
        <h2 className="wsite-countdown__title">До нашого дня</h2>
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
