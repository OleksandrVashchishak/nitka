---
paths:
  - "apps/web/src/app/website/**/*"
  - "apps/web/src/app/w/**/*"
  - "apps/web/src/components/website/**/*"
  - "apps/web/src/components/wedding-site/**/*"
---

<!-- Дзеркало .cursor/rules/website-editor.mdc — правити обидва. -->

# Website / editor

Три зони — **не змішуй** класи, стилі й папки між ними.

| Зона | Префікс | Код | Стилі |
|------|---------|-----|--------|
| Editor UI | `we-` | `components/website/editor/` | `styles/website/editor/` (`blocks/_we-*.scss`, `_variables.scss`) |
| Cabinet website | `ws-` | `components/website/` (dashboard, invites…) | `styles/website/blocks/_ws-*.scss` |
| Публічний сайт | `wsite-` | `components/wedding-site/` | `styles/wedding-site/` |

## Роути

- Кабінет / редактор: `/website`, `/website/edit`
- Публічний гостьовий сайт: `/w/[slug]` → рендерить `WeddingSite` (`wsite-*`)
- Preview в редакторі показує той самий публічний рендер у iframe (`preview-iframe.tsx` / `website-editor-preview.tsx`) — стилі публічного сайту мають жити в `wsite-`, не в `we-`

## Стилі

- Усі стилі живуть у `apps/web/src/styles/` (див. також `frontend.mdc`)
- Нові editor-блоки → `styles/website/editor/blocks/_we-….scss` + `@use` у `editor/index.scss`
- Нові cabinet `ws-` → `styles/website/blocks/` + `@use` у `website/index.scss`
- Нові секції сайту → `styles/wedding-site/blocks/_wsite-….scss` + секція в `sections/`
- Токени: `website/editor/_variables.scss` для `we-`, `website/_variables.scss` для `ws-`, `wedding-site/_variables.scss` для `wsite-`
- BEM як у `frontend.mdc`; не тягни editor chrome в публічний DOM і навпаки

## Правила змін

- Міняєш вигляд гостьового сайту → `wedding-site` + `wsite-*` (і preview підхопить)
- Міняєш chrome редактора (нав, таби, каталог) → тільки `we-*`
- Не клади `we-` класи на публічні секції «для зручності preview»
- Мінімальний diff; reuse існуючих табів/превʼю/каталогу перед новими абстракціями
