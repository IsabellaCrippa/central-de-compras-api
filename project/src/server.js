import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import cors from 'cors';

const app = express();

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/central')
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.log(err));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/suppliers', supplierRoutes);

// Rota de saúde da API
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API está funcionando' });
});


app.get('/', (req, res) => {
    res.send('API da Central de Compras funcionando!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});