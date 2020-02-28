# Geundung Bot
🤖 Telegram bot for me

## Telegram Setup

### 1. Check your CHAT_ID

- Send any message to your bot (Expires: 24h)
- Call telegram API (Using browser)

```
https://api.telegram.org/bot<API_KEY>/getUpdates
```

You can check info from `API Response data`

```json
{
  "ok": true,
  "result": [
    {
      "update_id": 852445952,
      "message": {
        "message_id": 1,
        "from": {
          "id": <THIS_IS_CHAT_ID>,
          "is_bot": false,
          "first_name": "-",
          "last_name": "-",
          "username": <THIS_IS_USER_ID>,
          "language_code": "en"
        },
        ...
      }
    },
    ...
  ]
}
```

### 2.

- Update `config/default.json`

```json
{
  "API_KEY": "---",
  "CHAT_ID": "---",
  "USER_ID": "---"
}
```

## Development

### Install dependencies
```bash
npm install

# Execute with babel
npm run dev
```

### Test
```bash
npm test
```

### Build
```bash
npm build
```

### Run
```bash
# Execute build code
npm start
```
