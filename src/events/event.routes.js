import { Router } from 'express';
import { createEvent, getEventsByRestaurant, updateEvent, deleteEvent } from './event.controller.js';
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

api.post('/add', [validateJwt, isAdmin], createEvent);
api.get('/list/restaurant/:restaurantId', getEventsByRestaurant);
api.put('/update/:id', [validateJwt, isAdmin], updateEvent);
api.delete('/delete/:id', [validateJwt, isAdmin], deleteEvent);

export default api;