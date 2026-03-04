import Table from './table.model.js';
import Restaurant from '../restaurants/restaurant.model.js';

// CREATE El Admin configura una mesa en un restaurante
export const createTable = async (req, res) => {
    try {
        const { restaurant, number, capacity } = req.body;

        const restaurantExists = await Restaurant.findById(restaurant);
        if (!restaurantExists) return res.status(404).send({ message: 'Restaurante no encontrado' });

        const table = new Table({ restaurant, number, capacity });
        await table.save();

        res.status(201).json({ success: true, message: 'Mesa creada', data: table });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear mesa', error: error.message });
    }
};

// READ Obtener las mesas de un restaurante específico
export const getTablesByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const tables = await Table.find({ restaurant: restaurantId, status: { $ne: 'inactiva' } })
                                  .sort({ number: 1 });

        res.status(200).json({ success: true, data: tables });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener mesas', error: error.message });
    }
};

// UPDATE El Admin edita capacidad o número de mesa
export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { number, capacity, status } = req.body; 

        const updatedTable = await Table.findByIdAndUpdate(
            id, 
            { number, capacity, status }, 
            { new: true, runValidators: true }
        );

        if (!updatedTable) return res.status(404).json({ message: 'Mesa no encontrada' });

        res.status(200).json({ success: true, message: 'Mesa actualizada', data: updatedTable });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar mesa', error: error.message });
    }
};

// DELETE Borrado Lógico para no romper las reservaciones existentes
export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTable = await Table.findByIdAndUpdate(id, { status: 'inactiva' }, { new: true });
        
        if (!deletedTable) return res.status(404).json({ message: 'Mesa no encontrada' });

        res.status(200).json({ success: true, message: 'Mesa desactivada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar mesa', error: error.message });
    }
};