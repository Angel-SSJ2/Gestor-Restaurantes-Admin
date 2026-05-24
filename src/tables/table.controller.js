import Table from './table.model.js';
import Restaurant from '../restaurants/restaurant.model.js';

// CREATE El Admin configura una mesa en un restaurante
export const createTable = async (req, res) => {
    try {
        const { restaurant, number, capacity, status } = req.body;

        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) return res.status(404).send({ message: 'Restaurante no encontrado' });

        const table = new Table({ 
            restaurant, 
            number, 
            capacity, 
            status: status || 'disponible' 
        });
        await table.save();

        res.status(201).json({ success: true, message: 'Mesa creada', data: table });
    } catch (error) {
        console.error("Error al crear mesa:", error);
        res.status(500).json({ success: false, message: 'Error al crear mesa', error: error.message });
    }
};


// READ Obtener todas las mesas activas e inactivas
export const getTables = async (req, res) => {
    try {
        const tables = await Table.find().sort({ number: 1 });
        res.status(200).json({ success: true, data: tables });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener mesas', error: error.message });
    }
};

// UPDATE El Admin edita capacidad o número de mesa
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, capacity, status, restaurant } = req.body;

        let updateData = { number, capacity, status };
        if (restaurant) {
            const restaurantExists = await Restaurant.findById(restaurant);
            if (!restaurantExists) return res.status(404).json({ message: 'Restaurante no encontrado' });
            updateData.restaurant = restaurant;
        }

        const updatedTable = await Table.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTable) return res.status(404).json({ message: 'Mesa no encontrada' });

        res.status(200).json({ success: true, message: 'Mesa actualizada', data: updatedTable });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar mesa', error: error.message });
    }
};

// DELETE Borrado Lógico si está activa, Borrado Físico si ya está inactiva
export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await Table.findById(id);
        
        if (!table) return res.status(404).json({ message: 'Mesa no encontrada' });

        if (table.status === 'inactiva') {
            await Table.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Mesa eliminada permanentemente' });
        } else {
            table.status = 'inactiva';
            await table.save();
            res.status(200).json({ success: true, message: 'Mesa desactivada correctamente' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar mesa', error: error.message });
    }
};