"use client";

import Image from "next/image";
import {
  DESIGN_OPTIONS,
  type DesignOption,
} from "@/components/website/editor/design-catalog";

type Props = {
  selectedId: string;
  onSelect: (option: DesignOption) => void;
};

export function WebsiteEditorDesignTab({ selectedId, onSelect }: Props) {
  return (
    <section className="we-catalog" aria-labelledby="we-catalog-title">
      <div className="we-catalog__head">
        <h1 id="we-catalog-title" className="we-catalog__title">
          Оберіть дизайн
        </h1>
        <p className="we-catalog__text">
          Неважливо, чи ви тільки починаєте шукати ідеї, чи вже рахуєте останні
          деталі — ми допоможемо вам організувати все необхідне.
        </p>
      </div>

      <div className="we-catalog__list" role="list">
        {DESIGN_OPTIONS.map((option) => {
          const active = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              role="listitem"
              className={`we-catalog__card${
                active ? " we-catalog__card--active" : ""
              }`}
              aria-pressed={active}
              onClick={() => onSelect(option)}
            >
              <div className="we-catalog__thumb">
                <Image
                  src={option.thumb}
                  alt=""
                  width={361}
                  height={177}
                  className="we-catalog__thumb-img"
                />
              </div>
              <div className="we-catalog__body">
                <div className="we-catalog__name-row">
                  <p className="we-catalog__name">{option.name}</p>
                  {active ? (
                    <span className="we-catalog__badge">Обраний</span>
                  ) : null}
                </div>
                <p className="we-catalog__desc">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
