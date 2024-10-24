import { authMiddleware } from '../../src/middleware/authMiddleware.js';

describe('AuthMiddleware', () => {
    let mockNext;
    const TOKEN = 'test-token';

    beforeEach(() => {
        mockNext = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });
        // Mock console methods
        console.error = jest.fn();
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('agrega el token de autorización', async () => {
        const middleware = authMiddleware(TOKEN)(mockNext);
        await middleware('test-url', {});

        expect(mockNext).toHaveBeenCalledWith(
            'test-url',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${TOKEN}`
                })
            })
        );
    });

    test('mantiene headers existentes', async () => {
        const existingHeaders = {
            'X-Custom': 'test'
        };

        const middleware = authMiddleware(TOKEN)(mockNext);
        await middleware('test-url', { headers: existingHeaders });

        expect(mockNext).toHaveBeenCalledWith(
            'test-url',
            expect.objectContaining({
                headers: expect.objectContaining({
                    ...existingHeaders,
                    'Authorization': `Bearer ${TOKEN}`
                })
            })
        );
    });

    test('maneja error de autenticación', async () => {
        const error = new Error('Unauthorized');
        mockNext.mockRejectedValueOnce(error);
        
        const middleware = authMiddleware(TOKEN)(mockNext);
        
        await expect(middleware('test-url', {}))
            .rejects
            .toThrow('Unauthorized');
        
        expect(console.error).toHaveBeenCalledWith(
            'Error de autenticación',
            'Unauthorized'
        );
    });
});