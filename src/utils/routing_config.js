"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routingControllerOptions = void 0;
const env_1 = require("../env");
exports.routingControllerOptions = {
    cors: true,
    routePrefix: env_1.env.app.apiPrefix,
    controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
    middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`]
};
