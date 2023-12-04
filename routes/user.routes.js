const controller = require('../controllers/userController');
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

    app.post('/user/create', upload.single('file'), controller.create);
    app.get('/user/delete/', controller.deleteById);
    app.get('/user/', controller.getAll);

    app.get('/user/:_id', controller.getById);
    app.put('/user/update/:_id', controller.updateById);
};
