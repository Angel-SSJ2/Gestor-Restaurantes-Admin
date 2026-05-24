import mongoose from 'mongoose';
import Event from './event.model.js';
import Restaurant from '../restaurants/restaurant.model.js';
import { cloudinary, uploadFileToCloudinary } from '../../middlewares/file-uploader.js';

// CREATE El Admin crea un evento para su restaurante
export const createEvent = async (req, res) => {
    try {
        const data = req.body;

        if (!data.restaurant) {
            return res.status(400).send({ success: false, message: 'El campo restaurant es obligatorio' });
        }

        if (!mongoose.Types.ObjectId.isValid(data.restaurant)) {
            return res.status(400).send({ success: false, message: 'El id de restaurant no es válido' });
        }

        const restaurantExists = await Restaurant.findById(data.restaurant);
        if (!restaurantExists) return res.status(404).send({ message: 'Restaurant no encontrado' });

        if (data.capacity === undefined) {
            return res.status(400).send({ success: false, message: 'La capacidad del evento es obligatoria' });
        }

        if (data.availableSpots === undefined) data.availableSpots = data.capacity;
        if (data.availableSpots > data.capacity) data.availableSpots = data.capacity;

        const event = new Event(data);

        if (req.file && req.file.buffer) {
            const uploadResult = await uploadFileToCloudinary(req.file, 'events');
            event.image = uploadResult.secure_url;
            event.imagePublicId = uploadResult.public_id;
        }

        await event.save();
        res.status(201).send({ success: true, message: 'Evento creado', data: event });
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).send({ success: false, message: 'Error en los datos del evento', error: error.message });
        }

        res.status(500).send({ success: false, message: 'Error al crear evento', error: error.message });
    }
};

// READ Listar todos los eventos
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ active: true }).sort({ date: 1 });
        res.send({ success: true, data: events });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error al obtener eventos', error: error.message });
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

// READ Obtener un evento por ID
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ success: false, message: 'Evento no encontrado' })

        res.json({ success: true, data: event })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message })
    }
};

// ACTUALIZAR
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = { ...req.body }

        if (updateData.availableSpots !== undefined && updateData.availableSpots < 0) {
            return res.status(400).json({ success: false, message: 'Los cupos no pueden ser negativos' })
        }

        if (updateData.availableSpots === 0) updateData.active = false
        if (updateData.availableSpots > 0) updateData.active = true

        if (req.file && req.file.buffer) {
            const current = await Event.findById(id)
            if (!current) {
                return res.status(404).json({ success: false, message: 'Evento no encontrado' })
            }

            if (current.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(current.imagePublicId)
                } catch (err) {
                    console.error('Error eliminando imagen anterior de Cloudinary:', err.message)
                }
            }

            const uploadResult = await uploadFileToCloudinary(req.file, 'events')
            updateData.image = uploadResult.secure_url
            updateData.imagePublicId = uploadResult.public_id
        }

        const updated = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' })
        }

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
        
        const current = await Event.findById(id)
        if (!current) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' })
        }

        if (current.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(current.imagePublicId)
            } catch (err) {
                console.error('Error eliminando imagen de Cloudinary al borrar evento:', err.message)
            }
        }

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

        if (quantity === undefined || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'La cantidad a reservar debe ser mayor que 0' })
        }

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