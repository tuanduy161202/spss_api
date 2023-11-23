const controller = require('../controllers/printconfigController');

module.exports = function (app) {
    app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
    });

    app.post('/printconfig/create/', controller.create);
    app.get('/printconfig/', controller.getAll);
    app.get('/printconfig/delete/:_id', controller.deleteById);
    app.get('/printconfig/:_id', controller.getById);
};
