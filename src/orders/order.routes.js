import { Router } from 'express';
import { createOrder, updateStatus, getAllOrders } from './order.controller.js';

const api = Router();

// El admin también puede crear pedidos manuales
api.post('/add', createOrder);
api.get('/list',  getAllOrders);
api.put('/update-status/:id', updateStatus);

export default api;