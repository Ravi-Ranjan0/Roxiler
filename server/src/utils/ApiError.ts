interface IApiErrorOptions {
  message?: string;
  errors?: any[];
  stack?: string;
}

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    { message = 'Something went wrong', errors = [], stack = '' }: IApiErrorOptions = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      ...(this.errors.length > 0 && { errors: this.errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }

  // Common error factory methods
  public static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, { message, errors });
  }

  public static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, { message });
  }

  public static forbidden(message = 'Forbidden') {
    return new ApiError(403, { message });
  }

  public static notFound(message = 'Not Found') {
    return new ApiError(404, { message });
  }

  public static internal(message = 'Internal Server Error') {
    return new ApiError(500, { message });
  }
}

export default ApiError;