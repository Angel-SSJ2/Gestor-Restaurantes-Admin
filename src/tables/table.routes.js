import { Router } from 'express';
import { createTable, getTablesByRestaurant, updateTable, deleteTable } from './table.controller.js';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

api.post('/add', [validateJwt, isAdmin], createTable);
api.get('/list/restaurant/:restaurantId', [validateJwt], getTablesByRestaurant);
api.put('/update/:id', [validateJwt, isAdmin], updateTable);
api.delete('/delete/:id', [validateJwt, isAdmin], deleteTable);

export default api;