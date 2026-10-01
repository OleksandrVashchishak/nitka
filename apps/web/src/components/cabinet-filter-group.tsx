export type CabinetFilterItem = {
  id: string;
  label: string;
  count: string | number;
};

export type CabinetFilterGroupProps = {
  title: string;
  items: CabinetFilterItem[];
  active: string;
  onChange: (id: string) => void;
};

export function CabinetFilterGroup({
  title,
  items,
  active,
  onChange,
}: CabinetFilterGroupProps) {
  return (
    <div className="cabinet-filter-group">
      <p className="cabinet-filter-title">{title}</p>
      <div className="cabinet-filter-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`cabinet-filter-item${active === item.id ? " is-active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            <span className="cabinet-filter-count">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
