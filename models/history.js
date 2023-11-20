const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const HistorySchema = new Schema({
    id: String,
    document_ids: Array,
    config_id: String,
    date: Date,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const History = mongoose.model('history', HistorySchema);
module.exports = History;