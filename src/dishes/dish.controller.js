import Dish from './dish.model.js';
import Restaurant from '../restaurants/restaurant.model.js';

// CREATE El Admin crea un platillo para un restaurante específico
export const addDish = async (req, res) => {
    try {
        const data = req.body;
        
        // Valida que el restaurante existe antes de crear el platillo
        const restaurantExists = await Restaurant.findById(data.restaurant);
        if (!restaurantExists) return res.status(404).send({ message: 'Restaurant not found' });

        if (data.stock === 0) data.available = false;

        const dish = new Dish(data);
        await dish.save();
        
        res.status(201).send({ success: true, message: 'Dish added to menu', dish });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error adding dish', err: err.message });
    }
};

// READ Obtener el menú de restaurante específico 
export const getMenuByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const dishes = await Dish.find({ restaurant: restaurantId, available: true });

        if (dishes.length === 0) {
            return res.status(404).send({ message: 'This restaurant has no menu items available' });
        }

        res.send({ success: true, restaurantId, menu: dishes });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error fetching menu', err: err.message });
    }
};

// UPDATE El Admin edita un platillo
export const updateDish = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.stock !== undefined) {
            data.available = data.stock > 0;
        }

        const updatedDish = await Dish.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updatedDish) return res.status(404).send({ message: 'Dish not found' });

        res.send({ success: true, message: 'Dish updated', updatedDish });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error updating dish', err: err.message });
    }
};

// DELETE Borrado físico o lógico
export const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDish = await Dish.findByIdAndDelete(id);
        if (!deletedDish) return res.status(404).send({ message: 'Dish not found' });

        res.send({ success: true, message: 'Dish removed from menu' });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error deleting dish', err: err.message });
    }
};