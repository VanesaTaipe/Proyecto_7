export class RequestError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'RequestError';
        this.originalError = originalError;
    }
}