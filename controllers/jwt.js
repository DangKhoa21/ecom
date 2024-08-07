'use strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'asdasdas';
function sign(email, expiresIn = '30m') {
    jwt.sign(
        { email },
        process.env.JWT_SECRET || 'jwt secret',
        { expiresIn }
    )
}

function verify(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}
module.exports = { sign, verify };