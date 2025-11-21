import express from 'express';
import { Router } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import cors from 'cors';

const router = Router();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/central')
.then(() =>console.log('Conectado ao MongoDB')).catch(err => console.log(err));

// ROTAS DA API
app.use('/', router);
app.use('/api/users', userRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/supplier', supplierRoutes)

app.listen(3000, () => {console.log('Servidor rodando na porta 3000')});

router.get('/', (req, res) => {
  res.send('API da Central de Compras funcionando!');
});