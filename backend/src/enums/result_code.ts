export enum EResultCode {
    /** redis 통신 에러 */
    ERROR_REDIS_RESPONSE_FAIL = -10,        // redis 통신 에러
    ERROR_DBMS_RESPONSE_FAIL = -9,          // DB 통신 에러
    ERROR_DBJOB_FAILED = -8,                // DB Job 실패

    FAILED = 0,
    SUCCESS = 1,

    ERROR_INVALID_ENUM_VALUE = 5,       // 유효하지 않은 enum 값

    ERROR_NOT_FOUND_USER = 10,          // 유저를 찾을 수 없음
    ERROR_INVALID_JWT_TOKEN = 11,       // JWT 토큰이 다름
    ERROR_LOGIN_FAILED = 12,            // 로그인 실패
    ERROR_NOT_FOUND_USER_PROFILE = 13,  // 유저 프로필 정보가 없음
    ERROR_ALREADY_JOIN_USER = 14,       // 이미 가입이 된 유저
}
export const EResultCode_Description = new Map<number, string>([
])