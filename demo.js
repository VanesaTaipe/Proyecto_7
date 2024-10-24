import { HttpClientBuilder } from './src/client/index.js';
import { loggingMiddleware } from './src/middleware/loggingMiddleware.js';
import { authMiddleware } from './src/middleware/authMiddleware.js';
import readline from 'readline';

const API_URL = 'http://localhost:8000/api';
const TEST_TOKEN = 'test-token';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function createClient() {
    return new HttpClientBuilder()
        .setBaseUrl(API_URL)
        .addMiddleware(loggingMiddleware)
        .addMiddleware(authMiddleware(TEST_TOKEN))
        .build();
}

async function runDemo() {
    console.clear();
    console.log('\n🚀 Demo Cliente HTTP');
    console.log('====================');
    console.log('URL del servidor:', API_URL);
    console.log('Token:', TEST_TOKEN);

    const client = await createClient();

    try {
        console.log('\n🔍 Verificando conexión...');
        await client.get('/posts');
        console.log('✅ Conexión establecida');

        while (true) {
            console.log('\n📋 Operaciones:');
            console.log('1️⃣  GET    - Listar posts');
            console.log('2️⃣  GET    - Obtener post específico');
            console.log('3️⃣  POST   - Crear nuevo post');
            console.log('4️⃣  PUT    - Actualizar post');
            console.log('5️⃣  DELETE - Eliminar post');
            console.log('6️⃣  Salir');

            try {
                const opcion = await question('\n➡️  Seleccione una opción (1-6): ');
                
                switch (opcion) {
                    case '1':
                        const posts = await client.get('/posts');
                        console.log('\n📬 Posts:', JSON.stringify(posts, null, 2));
                        break;

                    case '2':
                        const id = await question('🔑 ID del post: ');
                        const post = await client.get(`/posts/${id}`);
                        console.log('\n📝 Post:', JSON.stringify(post, null, 2));
                        break;

                    case '3':
                        const title = await question('📌 Título: ');
                        const body = await question('📄 Contenido: ');
                        const newPost = await client.post('/posts', { title, body });
                        console.log('\n✨ Post creado:', JSON.stringify(newPost, null, 2));
                        break;

                    case '4':
                        const updateId = await question('🔑 ID del post a actualizar: ');
                        const newTitle = await question('📌 Nuevo título: ');
                        const newBody = await question('📄 Nuevo contenido: ');
                        const updatedPost = await client.put(`/posts/${updateId}`, {
                            title: newTitle,
                            body: newBody
                        });
                        console.log('\n✏️  Post actualizado:', JSON.stringify(updatedPost, null, 2));
                        break;

                    case '5':
                        const deleteId = await question('🔑 ID del post a eliminar: ');
                        await client.delete(`/posts/${deleteId}`);
                        console.log('\n🗑️  Post eliminado exitosamente');
                        break;

                    case '6':
                        console.log('\n👋 ¡Gracias por usar el cliente HTTP!\n');
                        rl.close();
                        return;

                    default:
                        console.log('\n❌ Opción no válida');
                }
            } catch (error) {
                console.error('\n❌ Error:', error.message);
            }
            
            await question('\n⏎  Presione Enter para continuar...');
            console.clear();
        }
    } catch (error) {
        console.error('\n❌ Error de conexión:', error.message);
        rl.close();
    }
}

runDemo().catch(error => {
    console.error('\n💥 Error fatal:', error);
    rl.close();
});