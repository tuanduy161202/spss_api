const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    name: String,
    pages: Number,
    formant: String,
    status: String, // ready, selected, printing, printed
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Document = mongoose.model('documents', DocumentSchema);
module.exports = Document;