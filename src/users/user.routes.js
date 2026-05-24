import { Router } from 'express';
import { register, login } from '../auth/auth.controller.js'; 
import { update, deleteUser, list } from './user.controller.js'; 

const api = Router();

// Rutas públicas No necesitan token para entrar
api.post('/register', register); 
api.post('/login', login);

// Rutas protegidas Necesitan Token y, en Admin, ser Administrador
api.get('/list', list); 
api.put('/update/:id', update); 
api.delete('/delete/:id', deleteUser);

export default api;