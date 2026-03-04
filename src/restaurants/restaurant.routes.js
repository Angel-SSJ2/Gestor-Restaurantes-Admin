import { Router } from 'express';
import { addRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from './restaurant.controller.js';
import { searchRestaurants } from './restaurant.controller.js';

// restaurant.routes.js (ADMIN)
import { validateJwt } from '../../middlewares/validate-jwt.js';
import { isAdmin } from '../../middlewares/validate-roles.js';

const api = Router();

api.post('/add', [validateJwt, isAdmin], addRestaurant);
api.put('/update/:id', [validateJwt, isAdmin], updateRestaurant);
api.delete('/delete/:id', [validateJwt, isAdmin], deleteRestaurant);
api.get('/list', getRestaurants); 
api.post('/search', searchRestaurants);

export default api;