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
- Guest row: height 48, padding 14 16, gap 12, `border-radius: 5px`, bg `#F5F5F5`, рядки через gap 4px, text Montserrat Medium 14px `#1A1A1A`
- Linked cluster: суцільна смуга 4px `#C9CBE3` зліва через увесь кластер (разом із проміжками), без відступу й без link-іконки
- Child icon (`isChild`) — після імені
- Справа: assign pill (20px, 10px UPPERCASE) → аватар сторони (`ResponsibleAvatar` / `ResponsibleAvatarDuo` з імен партнерів) → ⋮
- Assign control: pill-select з шевроном — empty «Обрати групу» (білий, min 144px) / group (колір за порядком групи, 1-ша зелена) / президіум (wine); дитячий стіл — рожевий без шеврону. У приєднаних (не першого в кластері) pill показується лише якщо є значення
- ⋮ меню: якщо гість приєднаний — **Від’єднати від {ім’я}** (у плані — не для дитини в дитячому кріслі) (локальний `detachedKeys`); завжди блок «Статус» відповіді (`GuestRowMenu`)
- Parent→companions sync (`applyLinkedAssign`): не оверайтить дітей за дитячим столом і assignment `kids`
- Content card width ~612px (`seat-wiz-body.is-narrow`)
- Add group btn: lime `#F0FEBB` / `#F0FCBA`, pill 44px (див. AddButton.svg)
- Footer primary: «Розсадити автоматично» (ширша кнопка)
- Footer left на степі 2+: «Назад»
- Lead «Гості»: «Додайте гостей в групи… “Від’єднати”» (як у макеті)
- Draft: `detachedKeys: string[]` у `SeatingGuestsDraft`

## Поведінка

- «Розпочати розсадку» на empty state відкриває wizard
- Степ 1 → Далі → степ 2; Назад / стрілка — попередній степ / закриття
- Plus-one з гостя показується окремим linked-рядком
- Список гостей розсадки — **лише** `flattenSeatingGuests` з `lib/seating-guests.ts` (wizard, модалка груп, план). Не копіювати flatten у компоненти
- Ланцюжок = родина (`party:` / прізвище) + «+1»; **голова — перший дорослий**, дитина головою не буває; лише діти → без ланцюжка
- Дитина автоматом на «дитячий стіл» (якщо стіл увімкнено), **крім `high_chair` і `with_parents`** (сидять з батьками за дорослим столом). `kids_table` / без потреби → дитячий стіл (`childGoesToKidsTable`). У формі гостя дефолт — «За дитячий стіл»
- **Дитяче крісло** (`high_chair`): місця за столом не займає — `highChairHosts` (`lib/seating-guests.ts`) прив'язує дитину до дорослого (той, у чиїй картці дитина, інакше голова ланцюжка). На плані — маленький кружечок `.seat-plan-seat-chair` на місці дорослого, пересідає разом із ним; у лічильник столу не йде; у списку «посаджена», якщо сидить дорослий; drag дитини тягне дорослого; у PDF-розсадці ім'я йде після дорослого. Без дорослого / від'єднана — сідає як звичайний гість
- При завантаженні `syncKidsAssignments`: дитина без групи → `kids`; немає дитячого столу → `kids` знімається; ручну групу не чіпати
- Призначення з підтягуванням ланцюжка — `applyLinkedAssign` (діти за дитячим столом за родиною не йдуть)
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
- Interaction guests: **лише drag guest from list (or seat) → drop on seat / table** (table = first empty), без «вибрав гостя → клік по місцю»; drop на зайняте місце: сидячий гість міняється місцями, гість без місця витісняє (тост); ланцюжок сідає на найближчі місця (`lib/seating-place.ts`); drag image — кружечок з ініціалами + ім’я (`.seat-plan-drag-ghost`), не вся плитка; click seated seat opens popover; click empty seat → seat-pick модалка «Посадити» (desktop + mobile; кнопка «Фільтри» в ній лише на mobile); DnD desktop-only
- Pencil «Редагувати групи» → `SeatingGroupsModal` (1162px, 2 рівні колонки, заголовок Akzidenz Italic, кнопки «Скасувати» / «Додати»), не fullscreen wizard; сейв оновлює лише `draft.guests`, план столів не валить
- `detachedKeys` from wizard/modal breaks link only (гості лишаються у списку)
