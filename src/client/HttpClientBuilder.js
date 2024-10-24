import { HttpClient } from './HttpClient.js';
import { FetchAdapter } from '../adapters/HttpAdapter.js';

export class HttpClientBuilder {
    constructor() {
        this.baseUrl = '';
        this.middlewares = [];
        this.adapter = null;
    }

    setBaseUrl(url) {
        this.baseUrl = url;
        return this;
    }

    setAdapter(adapter) {
        this.adapter = adapter;
        return this;
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    build() {
        const client = new HttpClient(this.baseUrl, this.adapter || new FetchAdapter(this.baseUrl));
        this.middlewares.forEach(middleware => client.use(middleware));
        return client;
    }
}