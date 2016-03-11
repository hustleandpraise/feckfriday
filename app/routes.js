

var HomeController = require('./controllers/index');

module.exports = (app) => {
    app.use('/', HomeController);
}
