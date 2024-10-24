import { HttpAdapter, FetchAdapter } from '../../src/adapters/HttpAdapter.js';

describe('HttpAdapter', () => {
    describe('Base HttpAdapter', () => {
        test('constructor sets baseUrl', () => {
            const baseUrl = 'https://api.example.com';
            const adapter = new HttpAdapter(baseUrl);
            expect(adapter.baseUrl).toBe(baseUrl);
        });

        test('request method throws error', async () => {
            const adapter = new HttpAdapter('https://api.example.com');
            await expect(adapter.request({}))
                .rejects
                .toThrow('El método request debe ser implementado por las clases hijas');
        });
    });

    describe('FetchAdapter', () => {
        let adapter;
        let mockFetch;

        beforeEach(() => {
            adapter = new FetchAdapter('https://api.example.com');
            mockFetch = jest.fn();
            global.fetch = mockFetch;
        });

        test('makes successful request', async () => {
            const responseData = { data: 'test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(responseData)
            });

            const response = await adapter.request({
                method: 'GET',
                url: '/test'
            });

            expect(response.ok).toBe(true);
            const data = await response.json();
            expect(data).toEqual(responseData);
        });

        test('handles request with data', async () => {
            const requestData = { test: 'data' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            await adapter.request({
                method: 'POST',
                url: '/test',
                data: requestData
            });

            expect(mockFetch).toHaveBeenCalledWith(
                'https://api.example.com/test',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(requestData)
                })
            );
        });

        test('handles request error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(adapter.request({
                method: 'GET',
                url: '/test'
            })).rejects.toThrow('HTTP error! status: 404');
        });
    });
});