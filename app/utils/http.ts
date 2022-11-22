export enum ResponseHTTPErrorCode {
  BadRequest = 400,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  TooManyOpenConnections = 503,
  ServiceUnavailable = 503
}

export enum BadRequestDescription {
  InsufficientLiquidity = 'insufficient liquidity',
  UnsupportedToken = 'cannot sync'
}
