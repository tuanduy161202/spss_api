const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const HistorySchema = new Schema({
    document_id: String,
    config_id: String,
    status: String,
    finish_date: Date,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const History = mongoose.model('history', HistorySchema);
module.exports = History;