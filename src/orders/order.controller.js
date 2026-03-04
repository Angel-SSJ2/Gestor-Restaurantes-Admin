import Order from './order.model.js';
import Dish from '../dishes/dish.model.js';

export const createOrder = async (req, res) => {
    try {
        const { restaurant, items } = req.body;
        const userId = req.user.id; 

        let total = 0;
        // Validar cada plato y calcular precio real
        for (const item of items) {
            const dish = await Dish.findById(item.dish);
            if (!dish || !dish.available) {
                return res.status(404).send({ message: `Plato no disponible: ${item.dish}` });
            }
            if (dish.stock < item.quantity) {
                return res.status(400).send({ message: `Stock insuficiente para: ${dish.name}` });
            }
            total += dish.price * item.quantity;
            
            // Restar stock
            dish.stock -= item.quantity;
            if (dish.stock === 0) dish.available = false;
            await dish.save();
        }

        const order = new Order({
            user: userId,
            restaurant,
            items,
            totalPrice: total
        });

        await order.save();
        res.status(201).send({ success: true, message: 'Pedido creado', order });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al crear pedido', err: err.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const allowedStatus = ['PENDIENTE', 'PREPARANDO', 'ENTREGADO'];
        if (!status || !allowedStatus.includes(status.toUpperCase())) {
            return res.status(400).send({ message: 'Estado no válido' });
        }

        const order = await Order.findByIdAndUpdate(
            id, 
            { status: status.toUpperCase() }, 
            { new: true }
        );

        if (!order) return res.status(404).send({ message: 'Pedido no encontrado' });

        return res.send({ message: 'Estado actualizado correctamente', order });
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar estado', err });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .populate('items.dish', 'name price');
        res.send({ success: true, orders });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al obtener pedidos' });
    }
};