export class ValidationError extends Error { constructor(message) { super(message); this.name = 'ValidationError'; } }
export function getStatusCode(error) { return error?.name === 'ValidationError' ? 400 : 500; }
