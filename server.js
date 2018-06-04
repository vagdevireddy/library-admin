const express = require('express');
const app = express();
var path = require('path');

const port = process.env.PORT || 8080;
const baseUrl = `http://localhost:${port}`;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist' + '/index.html'));
});

app.get('*', (req, res) => {
  res.render('index', {
  req,
  res
});
});

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});
