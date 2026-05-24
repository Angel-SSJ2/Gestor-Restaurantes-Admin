import { Router } from 'express';
import { 
    addRestaurant, 
    getRestaurants, 
    getRestaurantById,
    updateRestaurant, 
    deleteRestaurant, 
    searchRestaurants 
} from './restaurant.controller.js';
import { uploadProfilePicture } from '../../middlewares/multer-upload.js';

const api = Router();

// Rutas Estándar (Recomendado)
api.get('/', getRestaurants);
api.get('/:id', getRestaurantById);
api.post('/', uploadProfilePicture.single('image'), addRestaurant);
api.put('/:id', uploadProfilePicture.single('image'), updateRestaurant);
api.delete('/:id', deleteRestaurant);
api.post('/search', searchRestaurants);

export default api;