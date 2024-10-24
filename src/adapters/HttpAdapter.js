export class HttpAdapter {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(config) {
        throw new Error('El método request debe ser implementado por las clases hijas');
    }
}

export class FetchAdapter extends HttpAdapter {
    constructor(baseUrl) {
        super(baseUrl);
    }

    async request(config) {
        const { method, url, data, headers = {} } = config;
        const fullUrl = `${this.baseUrl}${url}`;

        const requestConfig = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        // Solo agregar body si hay datos
        if (data) {
            requestConfig.body = JSON.stringify(data);
        }

        const response = await fetch(fullUrl, requestConfig);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }
}