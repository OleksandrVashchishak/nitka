---
paths:
  - "apps/web/src/components/seating*/**/*.{tsx,ts,scss}"
  - "apps/web/src/components/couple-seating-page.tsx"
  - "apps/web/src/styles/seating/**/*"
  - "apps/web/src/app/seating/**/*"
---

<!-- Дзеркало .cursor/rules/seating-wizard.mdc — правити обидва. -->

# Seating wizard (розсадка)

Повноекранний wizard поверх кабінету (`seat-wiz-*`). Стилі тримати однакові на всіх степах.

## Степи

1. Столи
2. Гості
3. Розсадка

## Токени

| Token | Value |
|---|---|
| Page bg | `#F3F3F3` |
| Accent lime (selected / active step) | `#F0FEBB` / step dot `#F0FCBA` |
| Selected format border | `#61040F` 1.5px |
| Default border | `#EBE5D4` 1px |
| Inactive step label | `#8C8582` |
| Text | `#1A1A1A` |
| Card bg | `#FFFFFF` |

## Типографіка

- Заголовок степу: Akzidenz (`--font-akzidenz`), Medium Italic, 32px, center, `#1A1A1A`
- Лейбл степу: Montserrat SemiBold 12px
- Питання / лейбли інпутів: Montserrat Medium 14px
- Заголовки карток («Оберіть формат»): Montserrat SemiBold 20px
- Підпис формату: Montserrat SemiBold 12px, center

## Компоненти

- **Step dot active:** 24×24, `border-radius: 12px`, bg `#F0FCBA`
- **Radio pill:** shared `RadioOption` (`@/components/ui/radio`) — wine `#61040F` + lime dot `#F0FEBB` (Frame SVG); pill `height 52`, `padding: 16px`, `gap: 16px`, `border-radius: 40px`; selected bg `#F0FEBB`; unselected border `#EBE5D4`; list gap `16px`
- **Input:** height 41, padding 12 16, `border-radius: 6px`, border `#EBE5D4`
- **Format card:** 176×121, gap 12, padding 12, `border-radius: 8px`; selected: bg `#F0FEBB` + border `1.5px #61040F`
- **Footer btns:** 144×44, padding 14 32, `border-radius: 40px` — Cancel outline, Next solid `#1A1A1A`

## Layout

- Контент по центру, ~612–960px (радіо/інпути тягнуться на ширину колонки; ряд форматів — 5×176 + gaps)
- Біла картка (`seat-wiz-card`) з `border-radius: 12px` і внутрішнім padding ~24px
- Footer sticky/fixed: Скасувати зліва, Далі справа
- Header: назад + `fata.studio` логотип

## Префікс класів

Тільки `seat-wiz-*`. Не мішати з `cabinet-*` / `smart-plan-*` / `we-*`.

## Степ 2 — Гості

- Заголовок: «Погрупуйте гостей для розсадки»
- Done step dot: `#252525` + біла галочка; active: `#F0FCBA`
- Guest row: height 48, padding 14 16, gap 12, `border-radius: 5px`, bg `#F7F7F7`, border-bottom 1px, text Montserrat Medium 14px `#1A1A1A`
- Linked cluster: shared bg, vertical connector `#C8D2E0` 2px left; companions indented 28px
- Companion icon: link glyph; child icon для `isChild`
- Assign control: завжди pill-select з шевроном — empty / group (color) / президіум (wine) / дитячий стіл (pink, UPPERCASE)
- ⋮ меню: президіум / дитячий / без групи / **Роз’єднати** (локальний `detachedKeys`)
- Parent→companions sync: не оверайтить `isChild` і assignment `kids`
- Content card width ~612px (`seat-wiz-body.is-narrow`)
- Add group btn: lime `#F0FEBB` / `#F0FCBA`, pill 44px (див. AddButton.svg)
- Footer primary: «Розсадити автоматично» (ширша кнопка)
- Footer left на степі 2+: «Назад»
- Lead «Гості»: згадує link-іконку + роз’єднання через ⋮
- Draft: `detachedKeys: string[]` у `SeatingGuestsDraft`

## Поведінка

- «Розпочати розсадку» на empty state відкриває wizard
- Степ 1 → Далі → степ 2; Назад / стрілка — попередній степ / закриття
- Plus-one з гостя показується окремим linked-рядком
- Діти (`[child]` у notes) автоматом на «дитячий стіл», якщо він увімкнений на степі 1
- Дитячий стіл (степ 1, якщо «Так»): кількість столів + форма «Круглий» / «Довгий»; місць на стіл — фікс 8
- Selected format border лишається wine `#61040F` (не lime)
- Формати (президіум окремим радіо): **Круглі столи** / **Довгі столи** / **Довгі + Круглі** / **П-форма** / **Т-форма**
- Іконки форматів — різні силуети зі стільцями (крапки), не «Президіум + …»
- IDs: `round` | `long` | `mixed` | `p-shape` | `t-shape` (legacy `presidium-*` нормалізується через `normalizeSeatingFormat`)

## Степ 3 — План розсадки (`seat-plan-*`)

Живе в кабінеті (сайдбар fata видно), не в fullscreen wizard.

- Title: Akzidenz Medium Italic 32px «Розсадка» + «Авто-збереження» Montserrat Medium 12px + green dot
- Header actions (right): лише «Зберегти PDF» + «Дизайн для друку»
- Canvas bar (над сіткою, не в хедері): «Додати стіл» зліва + «Показати імена» справа (`.seat-plan-canvas-bar`)
- Left panel: 291×702, radius 10, padding 16, gap 20, shadow `0 2px 12px #00000005`
- «Гості» SemiBold 18px; count Regular 12px
- Search: 260×36, radius 5, border `#D2D2D2`, Montserrat Medium 12px
- Filters box: bg `#F7F7F7`, radius 6, padding 8, gap 8; selects 26px height, border `#E9E9E9`, radius 5
- Guest row: height 52, padding 14 8, gap 8, radius 5 (right), Montserrat Medium 14px
- Canvas: **dot-grid** bg `#F3F3F3` (radial 24px), tables (presidium / round / long / kids / t / p) + seat chips
- **Table DnD:** pointer drag по столу (не seats), snap 24px; cursor grab/grabbing; клік без drag → модалка редагування
- **Table modal** (`SeatingTableModal`): preview + Зробити круглим/довгим, Додати крісло, Очистити, Видалити | Повернути 30/60/90/180 | Скасувати/Зберегти
- `PlanTable.rotation` (deg) — CSS transform на canvas; seats counter-rotate
- localStorage: ~~legacy~~ → **Postgres** `weddings.seating_draft` + `weddings.seating_plan` via `GET/PUT /api/seating`
- One-time migrate from old `fata-seating-*:v1` localStorage if DB empty
- Interaction guests: select guest left → click empty seat; **drag guest from list (or seat) → drop on seat / table** (table = first empty); click seated seat (no selection) opens popover; DnD desktop-only (mobile лишає seat-pick)
- Pencil «Редагувати групи» → `SeatingGroupsModal` (2 колонки), не fullscreen wizard; сейв оновлює лише `draft.guests`, план столів не валить
- `detachedKeys` from wizard/modal breaks link only (гості лишаються у списку)
