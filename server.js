const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const fetch = require('node-fetch');
const app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));

const port = process.env.PORT || 80;
const DATA_URI = process.env.DATA_URI || 'https://eventqueue.herokuapp.com/events';

app.get('/events', (req, res) => {
  console.log('Events requested');
  var jsonResponse;
  fetch(DATA_URI, {method: 'GET'}).
    then(res => res.json()).
    then((json) => {
      console.log(json);
      res.send(json);
    });
});

app.listen(port);
console.log("Server started at port " + port);
