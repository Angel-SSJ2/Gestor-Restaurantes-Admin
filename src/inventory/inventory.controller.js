import Inventory from './inventory.model.js';
import Restaurant from '../restaurants/restaurant.model.js';

export const addInventory = async (req, res) => {
    try {
        const data = req.body;
        const inventory = new Inventory(data);
        await inventory.save();
        res.status(201).send({ success: true, message: 'Producto registrado en el inventario', inventory });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al registrar insumo', err: err.message });
    }
};

export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().populate('restaurant', 'name');
        res.send({ success: true, inventory });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al obtener inventario', err: err.message });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = await Inventory.findByIdAndUpdate(id, data, { new: true });
        if (!updated) return res.status(404).send({ message: 'Insumo no encontrado' });
        res.send({ success: true, message: 'Insumo actualizado', updated });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al actualizar insumo', err: err.message });
    }
};

export const restockInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantityToAdd } = req.body;
        
        const item = await Inventory.findById(id);
        if (!item) return res.status(404).send({ message: 'Insumo no encontrado' });

        item.quantity += Number(quantityToAdd) || 0;
        await item.save();

        res.send({ success: true, message: 'Reabastecimiento completado', item });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al reabastecer insumo', err: err.message });
    }
};
