"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
const routing_controllers_1 = require("routing-controllers");
class HttpException extends routing_controllers_1.HttpError {
    constructor(status, message) {
        super(status, message);
        this.status = status;
        this.message = message;
    }
}
exports.HttpException = HttpException;
