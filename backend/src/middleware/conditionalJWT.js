const verifyJWT = require('./verifyJWT');

const conditionalJWT = (req, res, next) => {
    if (req.body.isUserLogged) {
        verifyJWT(req, res, next);
    } else {
        next();
    }
};

module.exports = conditionalJWT;
