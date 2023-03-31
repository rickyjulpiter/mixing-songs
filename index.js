const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'))

const {mixing, dynamicMixing} = require("./controller");

app.get('/', mixing)
app.get('/dynamic', dynamicMixing)

app.listen(port);
