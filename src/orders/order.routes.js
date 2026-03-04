import { Router } from 'express';
import { createOrder, updateStatus, getAllOrders } from './order.controller.js';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

// El admin también puede crear pedidos manuales
api.post('/add', [validateJwt, isAdmin], createOrder);
api.get('/list', [validateJwt, isAdmin], getAllOrders);
api.put('/update-status/:id', [validateJwt, isAdmin], updateStatus);

export default api;