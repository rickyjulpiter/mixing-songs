const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'))

const mixingAudio = require("./controller/mixingAudio.controller");
app.get('/', mixingAudio)

app.listen(port);
