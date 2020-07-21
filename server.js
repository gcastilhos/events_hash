const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const fetch = require('node-fetch');
const app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));

const port = process.env.PORT || 80;
const DATA_URI = 'https://eventqueue.herokuapp.com/events';

app.get('/events', (req, res) => {
  console.log('Events requested');
  var jsonResponse;
  fetch(DATA_URI, {method: 'GET'}).
    then(res => res.json()).
    then((json) => {
      let columns = [];
      let data = [];
      for (var key in json[0]) {
        columns.push(key);
        data.push(json[0][key]);
      }
      jsonResponse = {
        columns: columns,
        data: [data]
      }
      console.log(jsonResponse);
      res.send(jsonResponse);
    });
});

app.listen(port);
console.log("Server started at port " + port);
