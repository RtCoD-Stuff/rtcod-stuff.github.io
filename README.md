# Return to Castle of Dark — Официальный сайт

Статический сайт сервера **Return to Castle of Dark** (Forge 1.20.1, тёмное средневековое фэнтези), готовый к бесплатному деплою на **GitHub Pages**.

## Быстрая настройка

Все параметры вынесены в один файл `config.js`:
- `server.ip` и `server.enableLiveStatus: true` — IP вашего сервера на SolidHost (живой онлайн подтянется автоматически).
- `links.discord` / `links.telegram` — бессрочная ссылка Discord и ссылка на Telegram-канал.
- `links.launcherWin` / `links.launcherLinux` — ссылки на файлы лаунчера из GitHub Releases.
- `payment.shopBaseUrl` (или `checkoutUrl` у каждого товара) — ссылка на вашу кассу **EasyDonate / TradeMC** с привязанным RCON к серверу.

## Как выложить на GitHub Pages за 2 минуты

1. Создай публичный репозиторий (например `rtcod-site` на аккаунте сервера) и загрузи туда все файлы из этой папки.
2. Зайди в **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Через минуту сайт откроется по адресу `https://<username>.github.io/<repo>/`.

## Локальный просмотр

```bash
cd ~/Work/RtCoD_Site
python3 -m http.server 8080
# Открой http://localhost:8080 в браузере
```
