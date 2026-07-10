class APPError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errorDetails?: unknown,
  ) {
    super(message);
  }
}
export default APPError;
