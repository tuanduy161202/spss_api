const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PrintConfigSchema = new Schema({
    id: String,
    printer: String,
    pages_setting: String,
    page_orientation: String,
    page_size: String,
    margin: String,
    pages_per_sheet: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const PrintConfig = mongoose.model('printconfig', PrintConfigSchema);
module.exports = PrintConfig;