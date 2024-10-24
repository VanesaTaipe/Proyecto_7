import { HttpError } from '../errors/HttpError.js';
import { FetchAdapter } from '../adapters/HttpAdapter.js';

export class HttpClient {
    constructor(baseUrl, adapter = null) {
        this.baseUrl = baseUrl;
        this.adapter = adapter || new FetchAdapter(baseUrl);
        this.middlewares = [];
    }

    async request(method, path, options = {}) {
        const config = {
            method,
            url: path,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        };

        if (options.body) {
            config.data = options.body;
        }

        // Función base que realiza la petición
        let request = async (url, config) => {
            try {
                const response = await this.adapter.request(config);
                return response;
            } catch (error) {
                throw new HttpError(error.status || 500, error.message);
            }
        };

        // Construir la cadena de middleware en orden inverso
        // El último middleware agregado se ejecuta primero
        let chain = request;
        for (const middleware of [...this.middlewares].reverse()) {
            const next = chain;
            chain = async (url, config) => middleware(next)(url, config);
        }

        try {
            const response = await chain(path, config);
            return await response.json();
        } catch (error) {
            console.error('Error en la petición:', error.message);
            throw error;
        }
    }

    async get(path, options = {}) {
        return this.request('GET', path, options);
    }

    async post(path, data, options = {}) {
        return this.request('POST', path, {
            ...options,
            body: data
        });
    }

    async put(path, data, options = {}) {
        return this.request('PUT', path, {
            ...options,
            body: data
        });
    }

    async delete(path, options = {}) {
        return this.request('DELETE', path, options);
    }

    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
}