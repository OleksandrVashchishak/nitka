# NITKA mobile (Expo)

Клієнт до того ж Nest API, що й `apps/web`.

## Ролі

| Роль | Екрани |
|---|---|
| COUPLE | дім, чекліст, гості (+стіл, імпорт, delete), бюджет, план дня, заявки+чат, обране (+manual), весілля+фото, каталог |
| VENDOR | дашборд, заявки+чат (+badge), профіль+фото |
| ADMIN | стата, вендори, юзери, заявки, категорії, відгуки, контент |
| Public | каталог, профіль вендора, контент, запрошення, partner-invite |

Push: Expo token → `POST /api/notifications/push-token`. Шлеться на нову заявку / повідомлення / запрошення (на реальному девайсі, не в web).


## Start

```bash
cd apps/mobile
npm start
# web: npx expo start --web --port 8081
```

`.env`: `EXPO_PUBLIC_API_URL=http://localhost:3001`
