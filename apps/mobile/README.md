# fata.studio mobile (Expo)

Клієнт до того ж Nest API, що й `apps/web`.

## Ролі

| Роль | Екрани |
|---|---|
| COUPLE | дім, чекліст, гості, бюджет, план дня, мої підрядники, весілля, сайт |
| Public | контент (блог), partner-invite, RSVP |

Push: Expo token → `POST /api/notifications/push-token`.

## Start

```bash
cd apps/mobile
npm start
# web: npx expo start --web --port 8081
```

`.env`: `EXPO_PUBLIC_API_URL=http://localhost:3001`
