import { Router } from 'express';
import { createTable, getTables, updateTable, deleteTable } from './table.controller.js';

const api = Router();


api.post('/add', createTable);
api.get('/', getTables);
api.put('/update/:id', updateTable);
api.delete('/delete/:id', deleteTable);

export default api;