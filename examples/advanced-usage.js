import { HttpClientBuilder } from '../src/client/index.js';
import { loggingMiddleware } from '../src/middleware/loggingMiddleware.js';

console.log('🚀 Ejemplo Avanzado de Cliente HTTP');
console.log('==================================');

// Middleware personalizado de tiempo de respuesta
const timeMiddleware = next => async (url, config) => {
    const start = Date.now();
    try {
        const response = await next(url, config);
        const time = Date.now() - start;
        console.log(`⏱️  Tiempo de respuesta: ${time}ms`);
        return response;
    } catch (error) {
        const time = Date.now() - start;
        console.log(`⏱️  Tiempo hasta error: ${time}ms`);
        throw error;
    }
};

// Middleware de caché
const cacheMiddleware = () => {
    const cache = new Map();
    
    return next => async (url, config) => {
        if (config.method === 'GET' && cache.has(url)) {
            console.log('📦 Usando caché para:', url);
            return cache.get(url);
        }

        const response = await next(url, config);
        
        if (config.method === 'GET') {
            console.log('💾 Guardando en caché:', url);
            cache.set(url, response);
        }

        return response;
    };
};

// Crear cliente con configuración avanzada
const client = new HttpClientBuilder()
    .setBaseUrl('https://jsonplaceholder.typicode.com')
    .addMiddleware(loggingMiddleware)
    .addMiddleware(timeMiddleware)
    .addMiddleware(cacheMiddleware())
    .build();

// Ejemplos de uso avanzado
async function advancedExamples() {
    try {
        console.log('\n📥 Primera petición (sin caché):');
        const post1 = await client.get('/posts/1');
        console.log('📝 Post:', post1);

        console.log('\n📥 Segunda petición (usando caché):');
        const post2 = await client.get('/posts/1');
        console.log('📝 Post:', post2);

        console.log('\n📤 Creando nuevo post:');
        const newPost = await client.post('/posts', {
            title: 'Post Avanzado',
            body: 'Contenido con middleware personalizado',
            userId: 1
        });
        console.log('✨ Creado:', newPost);

        console.log('\n🔄 Actualizando post:');
        const updatedPost = await client.put('/posts/1', {
            title: 'Post Actualizado',
            body: 'Contenido actualizado'
        });
        console.log('✏️  Actualizado:', updatedPost);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Manejo de errores avanzado
async function errorHandlingExample() {
    console.log('\n🔍 Probando manejo de errores:');
    try {
        await client.get('/posts/999');
    } catch (error) {
        console.log('✅ Error manejado correctamente:', error.message);
    }
}

// Ejecutar ejemplos
(async () => {
    await advancedExamples();
    await errorHandlingExample();
})();