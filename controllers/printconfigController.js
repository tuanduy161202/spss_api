const db = require('../utils/db');
var ObjectID = require('mongoose').Types.ObjectId;
const PrintConfig = db.PrintConfig;

exports.create = (req, res) => {
    const configs = new PrintConfig({
        copies: req.body.copies,
        printer: req.body.printer,
        custom_print: req.body.custom_print,
        pages: req.body.pages,
        print_side: req.body.print_side,
        orientation: req.body.orientation,
        page_size: req.body.page_size,
        page_margin: req.body.page_margin,
        pages_sheet: req.body.pages_sheet,
        created_at: new Date(),
        updated_at: new Date(),
  });
    configs.save()
        .then(savedConfigs => {
            res.status(200).send({ status: 'success', message: 'PrintConfigs was created successfully!', data: savedConfigs });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getAll = (req, res) => {
    PrintConfig.find({})
        .sort({ created_at: -1 })
        .then(documents => {
            res.status(200).send({ status: 'success', data: documents });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getById = (req, res) => {
    PrintConfig.findById(req.params._id)
        .then(configs => {
            res.status(200).send({ status: 'success', data: configs });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.deleteById = (req, res) => {
    PrintConfig.deleteOne({ _id: req.params._id })
        .then(result => {
            console.log('PrintConfig deleted:', result);
        })
        .catch(error => {
            console.error('Error deleting document:', error);
        });
};