const db = require('../utils/db');
const History = db.History;

exports.create = (req, res) => {
    const history = new History({
        document_id: req.body.document_id,
        config_id: req.body.config_id,
        finish_date: req.body.finish_date,
        status: "inqueue",
        created_at: new Date(),
        updated_at: new Date(),
  });
    history.save()
        .then(savedHistory => {
            res.status(200).send({ status: 'success', message: 'PrintConfigs was created successfully!', data: savedHistory });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getAll = (req, res) => {
    History.find({})
        .sort({ created_at: -1 })
        .then(histories => {
            res.status(200).send({ status: 'success', data: histories });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getByStatus = (req, res) => {
    History.find({ status: req.params.status })
        .sort({ created_at: -1 })
        .then(histories => {
            res.status(200).send({ status: 'success', data: histories });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.getById = (req, res) => {
    History.findById(req.params._id)
        .sort({ created_at: -1 })
        .then(history => {
            res.status(200).send({ status: 'success', data: history });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.deleteById = (req, res) => {
    History.deleteOne({ _id: req.params._id })
        .then(result => {
            console.log('History deleted:', result);
        })
        .catch(error => {
            console.error('Error deleting document:', error);
        });
};

exports.updateById = (req, res) => {
    const id = req.params._id;
    const updateData = {
        document_id: req.body.document_id,
        config_id: req.body.config_id,
        finish_date: req.body.finish_date,
        status: req.body.status,
        update_at: new Date()
    };
    History.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedHistory => {
            if (!updatedHistory) {
                return res.status(404).send({ status: 'fail', message: 'History not found' });
            }
            res.status(200).send({ status: 'success', data: updatedHistory });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};