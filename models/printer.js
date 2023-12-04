const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PrinterSchema = new Schema({
    campus: String,
    building: String,
    level: String,
    code: String,
    type: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Printer = mongoose.model('printer', PrinterSchema);
module.exports = Printer;