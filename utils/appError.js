class AppError extends Error {
    constructor(message, statusCode) {

        // We use super to create constructor from the parrent class ERROR and the only parameter that this class get is Message
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;