import { Router } from 'express';
import { 
    createReservation, 
    getReservations, 
    updateReservation, 
    deleteReservation 
} from './reservation.controller.js';

const api = Router();

// Todas estas rutas en el ADMIN requieren Token y ser Admin
api.post('/add', createReservation);
api.get('/list', getReservations);
api.put('/update/:id', updateReservation);
api.delete('/delete/:id', deleteReservation);

export default api;