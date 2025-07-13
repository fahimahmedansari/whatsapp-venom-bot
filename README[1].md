# WhatsApp Venom Bot Server

## Features

- Send 6-digit OTP via WhatsApp
- Upload and send file to WhatsApp
- REST API using Express.js

## Usage

1. Install dependencies:

```bash
npm install
```

2. Start server and scan QR:

```bash
node index.js
```

3. Test API:
- `POST /send-otp` with `number`
- `POST /send-file` with `number` and file upload

## .env Example

```
PORT=3000
```