const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOURL,
  { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Welcome to my application.');
});

app.use(require('./app/middlewares/toCamel'));
app.use(require('./app/middlewares/mung'));

const User = require('./app/routes/user');

app.use('/users', User);


app.listen(port, () => {
});

//day la chinh sua lan 1