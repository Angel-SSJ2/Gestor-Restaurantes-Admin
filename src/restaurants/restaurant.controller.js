import Restaurant from './restaurant.model.js';

export const addRestaurant = async (req, res) => {
    try {
        const data = req.body;
        const restaurant = new Restaurant(data);
        await restaurant.save();
        return res.status(201).send({ message: 'Restaurant created successfully', restaurant });
    } catch (err) {
        return res.status(500).send({ message: 'Error creating restaurant', err });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ status: true });
        return res.send({ restaurants });
    } catch (err) {
        return res.status(500).send({ message: 'Error fetching restaurants', err });
    }
};

export const updateRestaurant = async (req, res) => {
    try {   
        const { id } = req.params;
        const data = req.body;
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });
        if (!updatedRestaurant) return res.status(404).send({ message: 'Restaurant not found' });
        
        return res.send({ message: 'Restaurant updated', updatedRestaurant });
    } catch (err) {
        return res.status(500).send({ message: 'Error updating restaurant', err });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await Restaurant.findByIdAndUpdate(id, { status: false }, { new: true });        
        if (!deletedRestaurant) return res.status(404).send({ message: 'Restaurant not found' });

        return res.send({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        return res.status(500).send({ message: 'Error deleting restaurant', err });
    }
};

export const searchRestaurants = async (req, res) => {
    try {        
        // El cliente envía el texto a buscar
        const { filter } = req.body; 
        
        // Buscamos coincidencias en nombre O categoría que estén activos
        if (!filter) return res.status(400).send({ message: 'Filter is required' });

        const restaurants = await Restaurant.find({
            status: true,
            $or: [
                //$regex y i para que busqueda sea insensible 
                { name: { $regex: filter, $options: 'i' } },
                { category: { $regex: filter, $options: 'i' } }
            ]
        });

        if (restaurants.length === 0) {
            return res.status(404).send({ message: 'No restaurants found with that filter' });
        }

        return res.send({ restaurants });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching restaurants', err });
    }
};