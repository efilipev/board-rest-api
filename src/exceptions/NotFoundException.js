const util = require("util");

function NotFoundException(message = "Not Found") {
    this.status = 404;
    this.message = message;
    Error.captureStackTrace(this, NotFoundException);
}

util.inherits(NotFoundException, Error);
NotFoundException.prototype.name = "NotFoundException";

module.exports = NotFoundException;
