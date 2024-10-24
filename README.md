# Proyecto7
# Cliente HTTP Modular y Extensible


## 📋 Índice
- [Descripción](#descripción)
- [Instalación](#instalación)
- [Arquitectura](#arquitectura)
- [Uso Básico](#uso-básico)
- [Ejemplos Avanzados](#ejemplos-avanzados)
- [Pruebas](#pruebas)
- [API Reference](#api-reference)
- [Middleware System](#middleware-system)
- [Patrones de Diseño](#patrones-de-diseño)

## 🎯 Descripción
Cliente HTTP modular y extensible que implementa patrones de diseño Builder y Adapter, con soporte para middleware y manejo de errores robusto. Desarrollado con ES Modules y tested al 100%.

### Características Principales
- ✅ Métodos HTTP: GET, POST, PUT, DELETE
- ✅ Sistema de Middleware extensible
- ✅ Manejo de errores robusto
- ✅ Arquitectura modular
- ✅ 100% coverage en pruebas

## 🚀 Instalación
```bash
git clone https://github.com/VanesaTaipe/Proyecto7.git
cd Proyecto7
npm install
npm install --save-dev jest @babel/core @babel/preset-env babel-jest
npm install express cors body-parser node-fetch

```

## 🏗️ Arquitectura
```
src/
├── adapters/          # Adaptadores HTTP
├── client/           # Cliente principal
├── errors/           # Manejo de errores
├── middleware/       # Sistema de middleware
└── index.js         # Punto de entrada
```

### Componentes Principales
1. **HttpClient**: Core del sistema
2. **HttpClientBuilder**: Constructor fluido
3. **Adapters**: Implementaciones HTTP
4. **Middleware**: Sistema de interceptores

## 💻 Uso Básico
```
import { HttpClientBuilder } from './src/client';
import { loggingMiddleware } from './src/middleware';

const client = new HttpClientBuilder()
    .setBaseUrl('https://api.example.com')
    .addMiddleware(loggingMiddleware)
    .build();

// GET Request
const data = await client.get('/users');

// POST Request
const user = await client.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
});
```

## 🔧 Ejemplos Avanzados
### Middleware Personalizado
```
const authMiddleware = token => next => async (url, config) => {
    const newConfig = {
        ...config,
        headers: {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        }
    };
    return next(url, newConfig);
};

const client = new HttpClientBuilder()
    .setBaseUrl('https://api.example.com')
    .addMiddleware(authMiddleware('my-token'))
    .build();
```

### Manejo de Errores
```
try {
    const data = await client.get('/protected-resource');
} catch (error) {
    if (error instanceof HttpError) {
        console.error(`HTTP Error: ${error.status}`);
    } else {
        console.error('Network Error:', error.message);
    }
}
```

## 🧪 Pruebas
### Coverage Report
```bash
npm run test:coverage
```

```
-----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------|---------|----------|---------|---------|-------------------
All files       |    100  |   95.23  |    100  |    100  |                   
-----------------|---------|----------|---------|---------|-------------------
```

### Ejecutar Pruebas
```bash
npm test
```

## 📚 API Reference
### HttpClient
```
class HttpClient {
    constructor(baseUrl, adapter = null)
    async get(path, options = {})
    async post(path, data, options = {})
    async put(path, data, options = {})
    async delete(path, options = {})
    use(middleware)
}
```

### HttpClientBuilder
```
class HttpClientBuilder {
    setBaseUrl(url)
    setAdapter(adapter)
    addMiddleware(middleware)
    build()
}
```

## 🔄 Middleware System
- **Orden de Ejecución**: FIFO (First In, First Out)
- **Cadena de Responsabilidad**: Cada middleware puede:
  - Modificar la request
  - Modificar la response
  - Manejar errores
  - Pasar al siguiente middleware

### Built-in Middleware
1. **loggingMiddleware**:
   ```
   import { loggingMiddleware } from './middleware';
   ```

2. **authMiddleware**:
   ```
   import { authMiddleware } from './middleware';
   ```

## 📐 Patrones de Diseño
### 1. Builder Pattern
```
const client = new HttpClientBuilder()
    .setBaseUrl('https://api.example.com')
    .addMiddleware(loggingMiddleware)
    .build();
```

### 2. Adapter Pattern
```
class CustomAdapter extends HttpAdapter {
    async request(config) {
    }
}
```

### 3. Middleware Pattern
```
const timeMiddleware = next => async (url, config) => {
    const start = Date.now();
    const response = await next(url, config);
    console.log(`Time: ${Date.now() - start}ms`);
    return response;
};
```

