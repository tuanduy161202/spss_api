const controller = require('../controllers/documentController');

module.exports = function (app) {
    app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
    });

    app.post('/documents/create', controller.create);
    app.get('/documents/', controller.getAll);
    app.get('/documents/selected/', controller.getSelected);
    app.put('/documents/update/:_id', controller.updateById);
};
