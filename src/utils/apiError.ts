export default class APIError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}
