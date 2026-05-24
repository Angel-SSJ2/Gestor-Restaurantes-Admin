import { Router } from 'express';
import { createEvent, getEvents, getEventsByRestaurant, getEventById, updateEvent, deleteEvent, reserveSpots } from './event.controller.js'
import { uploadProfilePicture } from '../../middlewares/multer-upload.js';
const api = Router();

api.post('/add', uploadProfilePicture.single('image'), createEvent);
api.get('/', getEvents);
api.get('/list/restaurant/:restaurantId', getEventsByRestaurant);
api.get('/:id', getEventById);
api.put('/update/:id', uploadProfilePicture.single('image'), updateEvent);
api.put('/reserve/:id', reserveSpots);
api.delete('/delete/:id', deleteEvent);

export default api;