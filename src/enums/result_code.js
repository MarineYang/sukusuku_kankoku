"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EResultCode_Description = exports.EResultCode = void 0;
var EResultCode;
(function (EResultCode) {
    /** redis 통신 에러 */
    EResultCode[EResultCode["ERROR_REDIS_RESPONSE_FAIL"] = -10] = "ERROR_REDIS_RESPONSE_FAIL";
    EResultCode[EResultCode["ERROR_DBMS_RESPONSE_FAIL"] = -9] = "ERROR_DBMS_RESPONSE_FAIL";
    EResultCode[EResultCode["ERROR_DBJOB_FAILED"] = -8] = "ERROR_DBJOB_FAILED";
    EResultCode[EResultCode["FAILED"] = 0] = "FAILED";
    EResultCode[EResultCode["SUCCESS"] = 1] = "SUCCESS";
    EResultCode[EResultCode["ERROR_INVALID_ENUM_VALUE"] = 5] = "ERROR_INVALID_ENUM_VALUE";
    EResultCode[EResultCode["ERROR_NOT_FOUND_USER"] = 10] = "ERROR_NOT_FOUND_USER";
    EResultCode[EResultCode["ERROR_INVALID_JWT_TOKEN"] = 11] = "ERROR_INVALID_JWT_TOKEN";
    EResultCode[EResultCode["ERROR_LOGIN_FAILED"] = 12] = "ERROR_LOGIN_FAILED";
    EResultCode[EResultCode["ERROR_NOT_FOUND_USER_PROFILE"] = 13] = "ERROR_NOT_FOUND_USER_PROFILE";
    EResultCode[EResultCode["ERROR_ALREADY_JOIN_USER"] = 14] = "ERROR_ALREADY_JOIN_USER";
})(EResultCode || (exports.EResultCode = EResultCode = {}));
exports.EResultCode_Description = new Map([]);
