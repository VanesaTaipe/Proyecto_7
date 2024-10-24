import { HttpClientBuilder } from '../src/client/index.js';
import { loggingMiddleware } from '../src/middleware/loggingMiddleware.js';

console.log('🚀 Ejemplo Básico de Cliente HTTP');
console.log('================================');

// Crear cliente
const client = new HttpClientBuilder()
    .setBaseUrl('https://jsonplaceholder.typicode.com')
    .addMiddleware(loggingMiddleware)
    .build();

// GET examples
async function getExamples() {
    console.log('\n📥 Ejemplos GET:');
    try {
        // Get single post
        const post = await client.get('/posts/1');
        console.log('\n📝 Post obtenido:', post);

        // Get comments
        const comments = await client.get('/posts/1/comments');
        console.log('\n💬 Primeros 2 comentarios:', comments.slice(0, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// POST example
async function postExample() {
    console.log('\n📤 Ejemplo POST:');
    try {
        const result = await client.post('/posts', {
            title: 'Nuevo Post',
            body: 'Contenido del post',
            userId: 1
        });
        console.log('\n✨ Post creado:', result);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar ejemplos
(async () => {
    await getExamples();
    await postExample();
})();