const controller = require('../controllers/historyController');

module.exports = function (app) {
    app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
    });

    app.post('/history/create', controller.create);
    app.get('/history/', controller.getAll);
    app.get('/history/status/:status', controller.getByStatus);
    app.get('/history/delete/:_id', controller.deleteById);
    app.put('/history/update/:_id', controller.updateById);
    app.get('/history/:_id', controller.getById);
};
