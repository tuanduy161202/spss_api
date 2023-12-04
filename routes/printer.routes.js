const controller = require('../controllers/printerController');

module.exports = function (app) {
    app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
    });

    app.post('/printer/create/', controller.create);
    app.get('/printer/', controller.getAll);
    app.get('/printer/delete/:_id', controller.deleteById);
    app.get('/printer/:_id', controller.getById);
};
