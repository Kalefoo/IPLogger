const express = require('express');
const axios = require('axios');

const app = express();

app.use((req, res) => {
  (async() => {
    const ipfy = await axios.get('https://api.ipify.org?format=json');
    const ipv4 = ipfy.data

    const info = await axios.get('https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_ChH34CnEDykyF4zlcFgc7huesXwzE&ipAddress=' + ipv4.ip);
    const data = info.data;

    res.send(data);
  });
});

app.listen(5000);