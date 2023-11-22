const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PrintConfigSchema = new Schema({
    copies: Number,
    printer: String,
    custom_print: String,
    pages: Array,
    print_side: String,
    orientation: String,
    page_size: String,
    page_margin: String,
    pages_sheet: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const PrintConfig = mongoose.model('printconfig', PrintConfigSchema);
module.exports = PrintConfig;