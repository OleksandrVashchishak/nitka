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
          Оберіть вигляд для вашого весільного сайту. Зміни можна робити в
          будь-який момент.
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
              {active ? (
                <span className="we-catalog__badge">Обраний</span>
              ) : null}
              <div className="we-catalog__thumb">
                <Image
                  src={option.thumb}
                  alt=""
                  width={64}
                  height={80}
                  className="we-catalog__thumb-img"
                />
              </div>
              <div className="we-catalog__body">
                <p className="we-catalog__name">{option.name}</p>
                <p className="we-catalog__desc">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
