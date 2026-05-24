import { Router } from 'express';
import { addInventory, getInventory, updateInventory, restockInventory } from './inventory.controller.js';

const api = Router();

api.post('/add', addInventory);
api.get('/list', getInventory);
api.put('/update/:id', updateInventory);
api.put('/restock/:id', restockInventory);

export default api;
