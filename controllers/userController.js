const db = require('../utils/db');
const User = db.User;

const { ObjectId } = require('mongodb');

exports.create = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        avatar: req.body.avatar,
        balance: req.body.balance,
        created_at: new Date(),
        updated_at: new Date(),
    });
    user.save()
        .then(savedUser => {
            res.status(200).send({ status: 'success', message: 'User was created successfully!', data: savedUser });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.deleteById = (req, res) => {
    User.deleteOne({ _id: params._id})
        .then(result => {
            console.log('User deleted:', result);
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
};
exports.getAll = (req, res) => {
    User.find({})
        .sort({ created_at: -1 })
        .then(users => {
            res.status(200).send({ status: 'success', data: users });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.getById = (req, res) => {
    User.findById(req.params._id)
        .then(user => {
            res.status(200).send({ status: 'success', data: user });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.updateById = (req, res) => {
    const id = req.params._id;
    const updateData = {
        name: req.body.name,
        avatar: req.body.avatar,
        balance: req.body.balance,
        updated_at: new Date()
    };
    User.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                return res.status(404).send({ status: 'fail', message: 'User not found' });
            }
            res.status(200).send({ status: 'success', data: updatedUser });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};      