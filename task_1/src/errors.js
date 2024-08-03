class CodedError extends Error {
  static EXT_API_ERROR = "EXT_API_ERROR";
  static CITY_NOT_FOUND = "CITY_NOT_FOUND";
  static API_ERROR = "API_ERROR";
  static INVALID_CITY = "INVALID_CITY";
  static TIMEOUOT = "TIMEOUT";

  constructor(code, status, message, extraInfo) {
    super(message);
    this.code = code;
    this.status = status;
    this.extraInfo = extraInfo;
  }
}

module.exports = CodedError;
