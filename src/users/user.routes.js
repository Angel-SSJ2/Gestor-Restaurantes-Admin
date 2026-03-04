import { Router } from 'express';
import { register, login } from '../auth/auth.controller.js'; 
import { update, deleteUser, list } from './user.controller.js'; 
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

// Rutas públicas No necesitan token para entrar
api.post('/register', register); 
api.post('/login', login);

// Rutas protegidas Necesitan Token y, en Admin, ser Administrador
api.get('/list', [validateJwt, isAdmin], list); 
api.put('/update/:id', [validateJwt], update); 
api.delete('/delete:id', [validateJwt], deleteUser);

export default api;