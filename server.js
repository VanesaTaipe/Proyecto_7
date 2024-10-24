import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8000;
const VALID_TOKEN = 'test-token';

// Configuración
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log('\n📥 Nueva Petición');
    console.log('🌐 URL:', req.url);
    console.log('�method:', req.method);
    console.log('🔑 Headers:', req.headers);
    next();
});

// Auth middleware
const verifyToken = (req, res, next) => {
    console.log('\n🔐 Verificando token...');
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log('❌ Token no encontrado');
        return res.status(401).json({
            error: 'Token requerido',
            message: 'Debe proporcionar un token de autorización'
        });
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== VALID_TOKEN) {
        console.log('❌ Token inválido');
        return res.status(401).json({
            error: 'Token inválido',
            message: 'El token proporcionado no es válido'
        });
    }

    console.log('✅ Token válido');
    next();
};

// Base de datos en memoria
let posts = [
    { id: 1, title: '📱 Primer Post', body: 'Contenido del primer post', userId: 1 },
    { id: 2, title: '💻 Segundo Post', body: 'Contenido del segundo post', userId: 1 }
];

// Rutas
app.get('/api/posts', verifyToken, (req, res) => {
    res.json(posts);
});

app.post('/api/posts', verifyToken, (req, res) => {
    const newPost = {
        id: posts.length + 1,
        ...req.body,
        userId: req.body.userId || 1
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.get('/api/posts/:id', verifyToken, (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
});

app.put('/api/posts/:id', verifyToken, (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
});

app.delete('/api/posts/:id', verifyToken, (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    const deletedPost = posts[index];
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.json(deletedPost);
});

app.listen(PORT, () => {
    console.clear();
    console.log('\n🚀 Servidor iniciado');
    console.log('==================');
    console.log('📡 URL:', `http://localhost:${PORT}`);
    console.log('🔑 Token:', VALID_TOKEN);
    console.log('\n📝 Endpoints disponibles:');
    console.log('GET    /api/posts');
    console.log('GET    /api/posts/:id');
    console.log('POST   /api/posts');
    console.log('PUT    /api/posts/:id');
    console.log('DELETE /api/posts/:id');
});

export default app;