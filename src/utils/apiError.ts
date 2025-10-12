interface ErrorDetails {
  message: string;
  [key: string]: unknown;
}

class APIError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;

    // Set the prototype explicitly to ensure instanceof works correctly
    Object.setPrototypeOf(this, APIError.prototype);
  }

  // Helper methods for checking error types
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  // Convert to a plain object for logging
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      data: this.data,
      stack: this.stack,
    };
  }
}

export default APIError;
export type { ErrorDetails };
