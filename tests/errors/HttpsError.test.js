import { HttpError } from '../../src/errors/HttpError.js';

describe('HttpError', () => {
    test('crea una instancia con status y mensaje', () => {
        const status = 404;
        const message = 'Not Found';
        const error = new HttpError(status, message);

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('HttpError');
        expect(error.status).toBe(status);
        expect(error.message).toBe(message);
    });

    test('mantiene la pila de error', () => {
        const error = new HttpError(500, 'Server Error');
        expect(error.stack).toBeDefined();
    });
});