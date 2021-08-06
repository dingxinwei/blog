const Application = require('./application');
function createApplication() {
  let app = function(req, res) {
    app.handler(req, res);
  }
  Object.assign(app, new Application(), Application.prototype);
  return app;
}
module.exports = createApplication;