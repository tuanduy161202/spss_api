const db = require('../utils/db');
//var ObjectID = require('mongoose').Types.ObjectId;
const Printer = db.Printer;

exports.create = (req, res) => {
    const printer = new Printer({
        campus: req.body.campus,
        building: req.body.building,
        level: req.body.level,
        code: req.body.code,
        type: req.body.type,
        created_at: new Date(),
        updated_at: new Date(),
  });
    printer.save()
        .then(savedPrinter => {
            res.status(200).send({ status: 'success', message: 'Printer was created successfully!', data: savedPrinter });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getAll = (req, res) => {
    Printer.find({})
        .sort({ created_at: -1 })
        .then(printers => {
            res.status(200).send({ status: 'success', data: printers });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getById = (req, res) => {
    Printer.findById(req.params._id)
        .then(printer => {
            res.status(200).send({ status: 'success', data: printer });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.deleteById = (req, res) => {
    Printer.deleteOne({ _id: req.params._id })
        .then(result => {
            console.log('Printer deleted:', result);
        })
        .catch(error => {
            console.error('Error deleting printer:', error);
        });
};
