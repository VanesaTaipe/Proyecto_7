import { HttpClient } from '../../src/client/HttpClient.js';
import { HttpAdapter, FetchAdapter } from '../../src/adapters/HttpAdapter.js';

describe('HttpClient', () => {
    let client;
    let mockFetch;

    beforeEach(() => {
        client = new HttpClient('https://api.example.com');
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        console.error = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        test('inicializa con adapter por defecto', () => {
            const client = new HttpClient('https://api.example.com');
            expect(client.adapter).toBeInstanceOf(FetchAdapter);
        });

        test('acepta un adapter personalizado', () => {
            const customAdapter = new HttpAdapter('https://api.example.com');
            const client = new HttpClient('https://api.example.com', customAdapter);
            expect(client.adapter).toBe(customAdapter);
        });
    });

    describe('Métodos HTTP', () => {
        test('GET request exitoso', async () => {
            const responseData = { data: 'test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(responseData)
            });

            const result = await client.get('/test');
            expect(result).toEqual(responseData);
        });

        test('POST request con datos', async () => {
            const postData = { name: 'test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1, ...postData })
            });

            const result = await client.post('/test', postData);
            expect(result).toHaveProperty('id');
            expect(result.name).toBe(postData.name);
        });

        test('PUT request con datos', async () => {
            const putData = { name: 'updated' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ id: 1, ...putData })
            });

            const result = await client.put('/test/1', putData);
            expect(result).toHaveProperty('id');
            expect(result.name).toBe(putData.name);
        });

        test('DELETE request exitoso', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            const result = await client.delete('/test/1');
            expect(result).toHaveProperty('success', true);
        });
    });

    describe('Manejo de errores', () => {
        test('maneja error HTTP', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            });

            await expect(client.get('/test'))
                .rejects
                .toThrow('HTTP error! status: 404');
        });

        test('maneja error de red', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network Error'));

            await expect(client.get('/test'))
                .rejects
                .toThrow('Network Error');
        });

        test('maneja error en el parsing JSON', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON'))
            });

            await expect(client.get('/test'))
                .rejects
                .toThrow('Invalid JSON');
        });
    });

    describe('Middleware', () => {
        test('ejecuta middleware en orden correcto', async () => {
            const order = [];
            
            // Primer middleware
            const middleware1 = next => async (url, config) => {
                try {
                    order.push('middleware1 before');
                    const result = await next(url, config);
                    order.push('middleware1 after');
                    return result;
                } catch (error) {
                    order.push('middleware1 error');
                    throw error;
                }
            };

            // Segundo middleware
            const middleware2 = next => async (url, config) => {
                try {
                    order.push('middleware2 before');
                    const result = await next(url, config);
                    order.push('middleware2 after');
                    return result;
                } catch (error) {
                    order.push('middleware2 error');
                    throw error;
                }
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            // Registrar middleware en orden
            client.use(middleware1);
            client.use(middleware2);

            await client.get('/test');

            // Verificar el orden de ejecución
            expect(order).toEqual([
                'middleware1 before',
                'middleware2 before',
                'middleware2 after',
                'middleware1 after'
            ]);
        });

        test('middleware maneja errores en orden', async () => {
            const order = [];
            const testError = new Error('Test error');

            const middleware1 = next => async (url, config) => {
                try {
                    order.push('middleware1 start');
                    return await next(url, config);
                } catch (error) {
                    order.push('middleware1 catch');
                    throw error;
                }
            };

            const middleware2 = next => async (url, config) => {
                try {
                    order.push('middleware2 start');
                    return await next(url, config);
                } catch (error) {
                    order.push('middleware2 catch');
                    throw error;
                }
            };

            mockFetch.mockRejectedValueOnce(testError);

            client.use(middleware1);
            client.use(middleware2);

            await expect(client.get('/test')).rejects.toThrow(testError);

            expect(order).toEqual([
                'middleware1 start',
                'middleware2 start',
                'middleware2 catch',
                'middleware1 catch'
            ]);
        });

        test('middleware puede modificar config', async () => {
            const testHeader = 'test-value';
            const middleware = next => async (url, config) => {
                const modifiedConfig = {
                    ...config,
                    headers: {
                        ...config.headers,
                        'X-Test': testHeader
                    }
                };
                return next(url, modifiedConfig);
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            client.use(middleware);
            await client.get('/test');

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-Test': testHeader
                    })
                })
            );
        });

        test('middleware puede modificar la respuesta', async () => {
            const middleware = next => async (url, config) => {
                const response = await next(url, config);
                return {
                    ...response,
                    json: () => Promise.resolve({ modified: true })
                };
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ original: true })
            });

            client.use(middleware);
            const result = await client.get('/test');
            expect(result).toHaveProperty('modified', true);
        });
    });
});