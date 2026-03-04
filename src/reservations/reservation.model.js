'use strict'

import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio']
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: [true, 'La mesa es obligatoria']
    },
    date: {
        type: Date,
        required: [true, 'La fecha de la reservación es obligatoria']
    },
    guests: {
        type: Number,
        required: [true, 'El número de personas es obligatorio'],
        min: [1, 'Debe haber al menos 1 persona']
    },
    status: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'finalizada'],
        default: 'pendiente'
    }
}, { timestamps: true })

// Índice útil para búsquedas por restaurante y fecha
reservationSchema.index({ restaurant: 1, date: 1 })

export default mongoose.model('Reservation', reservationSchema)