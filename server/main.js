const express = require('express')
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.listen(port)
