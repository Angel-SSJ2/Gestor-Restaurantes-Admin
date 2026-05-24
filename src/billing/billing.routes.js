import { Router } from 'express';
import { createBilling, getBillings } from './billing.controller.js';

const api = Router();

api.post('/add', createBilling);

api.get('/list', getBillings);

export default api;
