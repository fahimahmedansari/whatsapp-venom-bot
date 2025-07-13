const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('uploads'));

let client;

// OTP generator
function generateOTP(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

venom.create({
  session: 'session',
  multidevice: true
}).then((cli) => {
  client = cli;
  console.log('✅ WhatsApp client is ready!');
}).catch((err) => {
  console.error('❌ Failed to start Venom:', err);
});

app.post('/send-otp', async (req, res) => {
  const { number } = req.body;
  const otp = generateOTP();
  const phone = number + '@c.us';

  try {
    await client.sendText(phone, `🔐 Your OTP is: ${otp}`);
    res.status(200).json({ status: 'sent', otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/send-file', async (req, res) => {
  const { number } = req.body;
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const phone = number + '@c.us';
  const file = req.files.file;
  const filePath = path.join(__dirname, 'uploads', file.name);

  file.mv(filePath, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      await client.sendFile(phone, filePath, file.name, '📎 Here is your file.');
      res.status(200).json({ status: 'file sent', file: file.name });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});