const controller = require('../controllers/documentController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
    app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept'
    );
    next();
    });

    app.post('/documents/create', upload.single('file'), controller.create);
    app.get('/documents/download/:fileId', controller.download);
    app.get('/documents/selected/', controller.getSelected);
    app.get('/documents/', controller.getAll);

    app.get('/documents/:_id', controller.getById);
    app.put('/documents/update/:_id', controller.updateById);
};
