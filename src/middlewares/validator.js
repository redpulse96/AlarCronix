const { validateRequestHandler } = require('../utils');

async function validateRequest(req, res, next) {
  const { body } = req;
  const verb = `${req.method.toUpperCase()}_${req.url.split('/')[1]}`;
  const validationResp = validateRequestHandler(body, verb);
  if (validationResp.status) {
    next();
  } else {
    res.status(400);
    return res.send(validationResp);
  }
}

module.exports = validateRequest;
