require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const taskRoutes = require('./routes/tasks'); // Importe as rotas de tarefas

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('🟢 MongoDB conectado!'))
.catch(err => console.log('🔴 Erro ao conectar MongoDB:', err));

const app = express();

// Habilitando CORS para permitir requisições do frontend
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Usando as rotas
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes); // Agora o backend reconhece as rotas de tarefas

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
