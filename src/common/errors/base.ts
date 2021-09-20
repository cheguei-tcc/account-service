export class BaseError extends Error {
  constructor(msg: string, private readonly code: number) {
    super(msg);
  }
}
