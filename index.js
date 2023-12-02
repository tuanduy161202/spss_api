const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(cookieParser());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ encoding: 'utf-8' }));

//public folder
app.use('/static', express.static(__dirname + '/uploads'));

// simple route
//require('./routes/user.routes')(app);
require('./routes/document.routes')(app);
require('./routes/printconfig.routes')(app);
require('./routes/history.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
