"use client";

import Image from "next/image";
import {
  CUSTOM_DESIGN,
  DESIGN_OPTIONS,
  type DesignOption,
} from "@/components/website/editor/design-catalog";

type Props = {
  selectedId: string;
  onSelect: (option: DesignOption) => void;
  onSelectCustom: () => void;
};

type CardProps = {
  name: string;
  description: string;
  thumb: string;
  active: boolean;
  onClick: () => void;
};

function CatalogCard({ name, description, thumb, active, onClick }: CardProps) {
  return (
    <button
      type="button"
      role="listitem"
      className={`we-catalog__card${active ? " we-catalog__card--active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <div className="we-catalog__thumb">
        <Image
          src={thumb}
          alt=""
          width={361}
          height={177}
          className="we-catalog__thumb-img"
        />
      </div>
      <div className="we-catalog__body">
        <div className="we-catalog__name-row">
          <p className="we-catalog__name">{name}</p>
          {active ? <span className="we-catalog__badge">Обраний</span> : null}
        </div>
        <p className="we-catalog__desc">{description}</p>
      </div>
    </button>
  );
}

export function WebsiteEditorDesignTab({
  selectedId,
  onSelect,
  onSelectCustom,
}: Props) {
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
        {DESIGN_OPTIONS.map((option) => (
          <CatalogCard
            key={option.id}
            name={option.name}
            description={option.description}
            thumb={option.thumb}
            active={option.id === selectedId}
            onClick={() => onSelect(option)}
          />
        ))}
        <CatalogCard
          name={CUSTOM_DESIGN.name}
          description={CUSTOM_DESIGN.description}
          thumb={CUSTOM_DESIGN.thumb}
          active={selectedId === CUSTOM_DESIGN.id}
          onClick={onSelectCustom}
        />
      </div>
    </section>
  );
}
