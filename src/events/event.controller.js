import Event from './event.model.js';
import Restaurant from '../restaurants/restaurant.model.js';

// CREATE El Admin crea un evento para su restaurante
export const createEvent = async (req, res) => {
    try {
        const data = req.body;
        // Validar que el restaurante exista
        const restaurantExists = await Restaurant.findById(data.restaurant);
        if (!restaurantExists) return res.status(404).send({ message: 'Restaurant no encontrado' });

        if (data.availableSpots === undefined) data.availableSpots = data.capacity;

        const event = new Event(data);
        await event.save();
        res.status(201).send({ success: true, message: 'Evento creado', event });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error al crear evento', error: error.message });
    }
};

// READ Listar eventos de un restaurante específico
export const getEventsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const events = await Event.find({ restaurant: restaurantId, active: true }).sort({ date: 1 });
        res.send({ success: true, data: events });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error al obtener eventos', error: error.message });
    }
};

// ACTUALIZAR
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params

        if (req.body.availableSpots !== undefined && req.body.availableSpots < 0) {
            return res.status(400).json({ success: false, message: 'Los cupos no pueden ser negativos' })
        }

        if (req.body.availableSpots === 0) req.body.active = false
        if (req.body.availableSpots > 0) req.body.active = true

        const updated = await Event.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )

        res.json({
            success: true,
            message: 'Evento actualizado',
            data: updated
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message })
    }
}

// ELIMINAR
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params
        await Event.findByIdAndDelete(id)

        res.json({ success: true, message: 'Evento eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message })
    }
}

// RESERVAR CUPOS similar a reducir stock
export const reserveSpots = async (req, res) => {
    try {
        const { id } = req.params
        const { quantity } = req.body

        const event = await Event.findById(id)
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' })
        }

        if (event.availableSpots < quantity) {
            return res.status(400).json({ success: false, message: 'No hay suficientes cupos disponibles' })
        }

        event.availableSpots -= quantity
        if (event.availableSpots === 0) event.active = false

        await event.save()

        res.json({
            success: true,
            message: 'Cupos reservados',
            data: event
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}