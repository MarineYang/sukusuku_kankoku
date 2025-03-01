"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const winston_1 = require("winston");
const DailyRotateFile = __importStar(require("winston-daily-rotate-file"));
const { combine, timestamp, printf, prettyPrint, colorize, json, errors, } = winston_1.format;
const logDirectory = "logs";
const filename = (0, path_1.join)(logDirectory, "app-%DATE%.log");
const level = process.env.NODE_ENV === "production" ? "error" : "debug";
if (!(0, fs_1.existsSync)(logDirectory)) {
    (0, fs_1.mkdirSync)(logDirectory);
}
/**
 * 콘솔 로그 출력 포맷 설정
 */
const consoleOutputFormat = combine(colorize(), prettyPrint(), json(), printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
}));
/**
 * 파일 로그 출력 포맷 설정
 */
const fileOutputFormat = combine(printf((info) => {
    if (info.stack) {
        return `${info.timestamp} ${info.level} ${info.message} : ${info.stack}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
}));
const options = {
    level,
    exitOnError: false,
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true })),
    transports: [
        // 콘솔 로그 출력
        new winston_1.transports.Console({
            handleExceptions: true,
            format: consoleOutputFormat,
        }),
        // 파일 로그 출력
        new DailyRotateFile({
            handleExceptions: true,
            format: fileOutputFormat,
            filename,
        }),
    ],
};
const logger = (0, winston_1.createLogger)(options);
exports.logger = logger;
const stream = {
    write: (message) => {
        logger.info(message);
    },
};
exports.stream = stream;
