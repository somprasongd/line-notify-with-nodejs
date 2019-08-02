require('dotenv').config();
const express = require('express');
const uuidv4 = require('uuid/v4');
const axios = require('axios');
const querystring = require('querystring');

const db = [];

const app = express();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

app.get('/', (req, res) => {
  res.send('Line Notify demo with Node.js');
});

app.get('/connect/:uid', (req, res) => {
  const { uid } = req.params;

  const token = db.find(token => token.uid === uid);

  if (token) return res.status(400).send('This uid already connected');

  const params = `response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}?uid=${uid}&scope=notify&state=${uuidv4()}`;

  res.redirect(`https://notify-bot.line.me/oauth/authorize?${params}`);
});

app.get('/callback', async (req, res) => {
  const { uid, code, state } = req.query;

  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${REDIRECT_URI}?uid=${uid}`,
    client_id: `${CLIENT_ID}`,
    client_secret: `${CLIENT_SECRET}`
  };

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  try {
    const { data } = await axios.post(
      'https://notify-bot.line.me/oauth/token',
      querystring.stringify(body),
      config
    );

    const { access_token } = data;

    const newToken = { uid, access_token };

    db.push(newToken);

    res.send(newToken);
  } catch (err) {
    const { response } = err;
    res.status(response.status).send(response.data);
  }
});

app.get('/notify/:uid', async (req, res) => {
  const { uid } = req.params;
  const { message } = req.query;

  const token = db.find(token => token.uid === uid);

  if (!token) return res.redirect(`/connect/${uid}`);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token.access_token}`
    }
  };

  try {
    const { data } = await axios.post(
      'https://notify-api.line.me/api/notify',
      querystring.stringify({ message }),
      config
    );

    res.send(data);
  } catch (err) {
    console.log(err);

    const { response } = err;
    res.status(response.status).send(response.data);
  }
});

app.get('/revoke/:uid', async (req, res) => {
  const { uid } = req.params;

  const token = db.find(token => token.uid === uid);

  if (!token) return res.status(404).send('No access token');

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token.access_token}`
    }
  };

  try {
    const { data } = await axios.post(
      'https://notify-api.line.me/api/revoke',
      '',
      config
    );

    res.send(data);
  } catch (err) {
    const { response } = err;
    res.status(response.status).send(response.data);
  }
});

app.listen(8080, console.log('Server started on port 8080'));
