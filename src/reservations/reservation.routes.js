import { Router } from 'express';
import { 
    createReservation, 
    getReservations, 
    updateReservation, 
    deleteReservation 
} from './reservation.controller.js';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

// Todas estas rutas en el ADMIN requieren Token y ser Admin
api.post('/add', [validateJwt, isAdmin], createReservation);
api.get('/list', [validateJwt, isAdmin], getReservations);
api.put('/update/:id', [validateJwt, isAdmin], updateReservation);
api.delete('/delete/:id', [validateJwt, isAdmin], deleteReservation);

export default api;