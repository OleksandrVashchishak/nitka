"use client";

import {
  splitTableColumns,
  type SeatingChartData,
} from "@/lib/seating-chart";

type Props = {
  data: SeatingChartData;
};

function NameList({ names, className }: { names: string[]; className?: string }) {
  if (names.length === 0) return null;
  return (
    <ul className={className}>
      {names.map((name, i) => (
        <li key={`${name}-${i}`}>{name}</li>
      ))}
    </ul>
  );
}

/** «Сучасний» — Frame 74, 990×728 @1x. Tables = who sits where. */
export function SeatingChartModern({ data }: Props) {
  return (
    <article
      className="seat-chart-sheet seat-chart-sheet--modern"
      aria-label="Посадкова карта"
    >
      {data.presidium.length > 0 ? (
        <header className="seat-chart-modern__presidium">
          <h2 className="seat-chart-modern__section-title">Стіл наречених</h2>
          <div className="seat-chart-modern__rule" aria-hidden />
          <p className="seat-chart-modern__presidium-names">
            {data.presidium.join("  ")}
          </p>
        </header>
      ) : null}

      <div className="seat-chart-modern__body">
        <p className="seat-chart-modern__couple" aria-label={data.coupleLabel}>
          {data.coupleLabel}
        </p>

        <div className="seat-chart-modern__tables">
          {data.tables.map((table) => {
            const cols = splitTableColumns(table.names);
            return (
              <section
                key={table.id}
                className={`seat-chart-modern__table${
                  cols.length > 1 ? " is-wide" : ""
                }`}
                aria-label={table.label}
              >
                <h3 className="seat-chart-modern__table-label">{table.label}</h3>
                <div className="seat-chart-modern__table-rule" aria-hidden />
                <div className="seat-chart-modern__table-cols">
                  {cols.map((col, colIndex) => (
                    <div key={colIndex} className="seat-chart-modern__col">
                      <NameList
                        names={col}
                        className="seat-chart-modern__names"
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <footer className="seat-chart-modern__footer">
        {data.kids.length > 0 ? (
          <div className="seat-chart-modern__kids">
            <h2 className="seat-chart-modern__section-title">Діти</h2>
            <div
              className="seat-chart-modern__rule seat-chart-modern__rule--kids"
              aria-hidden
            />
            <p className="seat-chart-modern__kids-names">
              {data.kids.join("  ")}
            </p>
          </div>
        ) : (
          <span />
        )}
        {data.dateLabel ? (
          <p className="seat-chart-modern__date">{data.dateLabel}</p>
        ) : null}
      </footer>
    </article>
  );
}
