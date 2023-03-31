const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'))

const mixingSong = require("./controller/mixingSong.controller");
app.get('/', mixingSong)

app.listen(port);
