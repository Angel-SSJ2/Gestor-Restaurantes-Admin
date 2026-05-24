import Reservation from './reservation.model.js';
import Table from '../tables/table.model.js';

// CREATE Registrar una nueva reserva
export const createReservation = async (req, res) => {
    try {
        const { restaurant, table, date, guests, user } = req.body;

        //  Validar fecha No pasada
        if (new Date(date) < new Date()) {
            return res.status(400).send({ message: 'La fecha no puede ser en el pasado' });
        }

        // Validar capacidad de la mesa
        const tableData = await Table.findById(table);
        if (!tableData) return res.status(404).send({ message: 'Mesa no encontrada' });
        
        if (guests > tableData.capacity) {
            return res.status(400).send({ 
                message: `Capacidad insuficiente. Esta mesa solo admite ${tableData.capacity} personas.` 
            });
        }

        // Validar choque de horario (Misma mesa, misma fecha/hora)
        const isReserved = await Reservation.findOne({ table, date, status: { $ne: 'reservada' } });
        if (isReserved) {
            return res.status(400).send({ message: 'Esta mesa ya está reservada para ese horario' });
        }

        const reservation = new Reservation({
            user: user,
            restaurant,
            table,
            date,
            guests
        });

        await reservation.save();
        res.status(201).send({ success: true, message: 'Reservación creada', reservation });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al crear reservación', err: err.message });
    }
};

// READ Listar todas solo para el Admin
export const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'name email')
            .populate('restaurant', 'name')
            .populate('table', 'number');
        res.send({ success: true, reservations });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al listar reservaciones', err: err.message });
    }
};

// UPDATE Editar estado o datos
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await Reservation.findByIdAndUpdate(id, data, { new: true });
        if (!updated) return res.status(404).send({ message: 'Reservación no encontrada' });

        res.send({ success: true, message: 'Reservación actualizada', updated });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al actualizar', err: err.message });
    }
};

// DELETE Borrado físico
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Reservation.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send({ message: 'Reservación no encontrada' });

        res.send({ success: true, message: 'Reservación eliminada' });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error al eliminar', err: err.message });
    }
};