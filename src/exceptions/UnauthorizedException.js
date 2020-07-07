const util = require('util');

function UnauthorizedException(message = 'Unauthorized') {
    this.status = 401;
    this.message = message;
    Error.captureStackTrace(this, UserNotFoundException)
}

util.inherits(UnauthorizedException, Error);
UnauthorizedException.prototype.name = 'UnauthorizedException';

module.exports = UnauthorizedException;
