const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
    id: Number,
    name: String,
    pages: Number,
    formant: String,
    selected: Boolean,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
});

const Document = mongoose.model('documents', DocumentSchema);
module.exports = Document;