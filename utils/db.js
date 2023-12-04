const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
mongoose.Promise = global.Promise;

const url = 'mongodb+srv://spss:spss@spss.izh8jyp.mongodb.net/SPSS?retryWrites=true&w=majority';

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const client = new MongoClient(url, connectionParams);

const db = {};
db.mongoose = mongoose;

db.Document = require('../models/documents');
db.PrintConfig = require('../models/printconfig');
db.History = require('../models/history');
db.Printer = require('../models/printer');
db.User = require('../models/user');

async function initializeGridFSBucket() {
    try {
        await client.connect();
        const dbInstance = client.db('SPSS'); // Replace with your database name
        db.gfsBucket = new GridFSBucket(dbInstance);
        console.log('Connected to GridFSBucket');
    } catch (error) {
        console.error('Error connecting to GridFSBucket:', error);
        throw error;
    }
}

initializeGridFSBucket();

// Error handling for main database connection
mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to the database. \n${err}`);
});

// Connect to the main database
mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to the main database');
    });

module.exports = db;