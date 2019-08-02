# Line Notify demo with Node.js

## Prerequisite

- [Ngrok](https://ngrok.com/download)

```bash
ngrok http 8080


Web Interface                 http://127.0.0.1:4040
Forwarding                    http://XYZ.ngrok.io -> http://localhost:8080
Forwarding                    https://XYZ.ngrok.io -> http://localhost:8080
```

- [Line Notify Service Provider](https://notify-bot.line.me/my/services) and set `Callback URL` with ngrok url (`https://XYZ.ngrok.io`)

- Create `.env` file

```text
CLIENT_ID=XXXXXX
CLIENT_SECRET=YYYYYYY
REDIRECT_URI=https://XYZ.ngrok.io
```

## Start Server

- Install dependencies `npm install`

- Run demo app `npm start`
