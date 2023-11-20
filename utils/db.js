const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb+srv://spss:spss@spss.izh8jyp.mongodb.net/SPSS?retryWrites=true&w=majority';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url,connectionParams)
.then(() => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})

const db = {};
db.mongoose = mongoose;

db.Document = require('../models/documents');
db.PrintConfig = require('../models/printconfig');
db.History = require('../models/history');

module.exports = db;
