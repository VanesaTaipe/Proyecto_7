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
Este cliente HTTP modular y extensible fue desarrollado para proporcionar una solución flexible y robusta para realizar peticiones HTTP, implementando patrones de diseño modernos y un sistema de middleware extensible.

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
examples/
|___advanced-usage.js
|___basic-usage.js

tests/
|___adapters
|___client
|___errors
|___middleware
```

### Componentes Principales
1. **HttpClient**: Core del sistema:
   
```
  export class HttpClient {
    constructor(baseUrl, adapter = null) {
        this.baseUrl = baseUrl;
        this.adapter = adapter || new FetchAdapter(baseUrl);
        this.middlewares = [];
    }
```

2. **HttpClientBuilder**: Constructor fluido:

```
export class HttpClientBuilder {
    constructor() {
        this.baseUrl = '';
        this.middlewares = [];
    }
   ```
3. **Adapters**: Implementaciones HTTP
   
   * BUilder y Adapter
4. **Middleware**: Sistema de interceptores

## 💻 Uso Básico
En este caso podemos ejecutar el `basic-usage.js` para ver como funciona todo el codigo es una pequeña simulación.
```
node basic-usage.js
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

- **Cadena de Responsabilidad**: Cada middleware puede:
  - Modificar la request
  - Modificar la response
  - Manejar errores
  - Pasar al siguiente middleware

### Built-in Middleware
1. **loggingMiddleware**:
El loggingMiddleware es un interceptor que registra información sobre las peticiones HTTP y sus respuestas, proporcionando visibilidad sobre el flujo de comunicación.
* Registrar peticiones y respuestas HTTP
* Facilitar el debugging
* Monitorear tiempos de respuesta
* Tracking de errores
   ```
   import { loggingMiddleware } from './middleware';
   ```

2. **authMiddleware**:
El authMiddleware es un interceptor que maneja la autenticación de las peticiones HTTP, agregando automáticamente los headers de autorización necesarios.
* Manejar tokens de autenticación
* Agregar headers de autorización
* Centralizar la lógica de autenticación
* Mantener la seguridad de las peticiones
   ```
   import { authMiddleware } from './middleware';
   ```

## 📐 Patrones de Diseño
### 1. Builder Pattern
* Permite la construcción paso a paso del cliente HTTP
* Proporciona una interfaz fluida para la configuración
*Separa la construcción de la representación

```
const client = new HttpClientBuilder()
    .setBaseUrl('https://api.example.com')
    .addMiddleware(loggingMiddleware)
    .build();
```

### 2. Adapter Pattern
Permite cambiar la implementación HTTP subyacente
Facilita el testing mediante mocks
Proporciona una interfaz consistente

```
class HttpAdapter {
    async request(config) {
        throw new Error('Método no implementado');
    }
}

class FetchAdapter extends HttpAdapter {
    async request(config) {
    }
}
```


