import Billing from './billing.model.js';
import Order from '../orders/order.model.js';
import { cloudinary, uploadFileToCloudinary } from '../../middlewares/file-uploader.js';

export const createBilling = async (req, res) => {
    try {
        const { order, paymentMethod, amount } = req.body;

        // Validar que la orden existe
        const existingOrder = await Order.findById(order);
        if (!existingOrder) {
            return res.status(404).send({ message: 'Orden no encontrada' });
        }

        const billing = new Billing({
            order,
            paymentMethod,
            amount: Number(amount) || existingOrder.totalPrice
        });

        await billing.save();

        // Actualizar el estado de la orden a ENTREGADO
        existingOrder.status = 'ENTREGADO';
        await existingOrder.save();

        res.status(201).send({ success: true, message: 'Factura generada y orden pagada', billing });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al generar factura', err: err.message });
    }
};

export const getBillings = async (req, res) => {
    try {
        const billings = await Billing.find()
            .populate({
                path: 'order',
                populate: [
                    { path: 'user', select: 'name username' },
                    { path: 'restaurant', select: 'name' }
                ]
            });
        res.send({ success: true, billings });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al obtener facturas', err: err.message });
    }
};
