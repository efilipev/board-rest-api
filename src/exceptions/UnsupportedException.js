const util = require("util");

function UnsupportedException(field, message) {
    this.status = 422;
    this.field = field;
    this.message = message;
    Error.captureStackTrace(this, UnsupportedException);
}

util.inherits(UnsupportedException, Error);
UnsupportedException.prototype.name = "UnsupportedException";

module.exports = UnsupportedException;
