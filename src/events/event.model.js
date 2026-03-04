'use strict'

import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del evento es obligatorio'],
        trim: true,
        maxLength: [120, 'Máximo 120 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [300, 'Máximo 300 caracteres']
    },
    type: {
        type: String,
        required: true,
        enum: ['cena temática', 'festival', 'degustación', 'taller']
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    location: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
        trim: true
    },
    price: {
        type: Number,
        min: [0, 'El precio no puede ser negativo'],
        default: 0
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [0, 'No puede ser negativa']
    },
    availableSpots: {
        type: Number,
        required: true,
        min: [0, 'No puede ser negativo']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante que organiza el evento es obligatorio']
    },
    active: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true })

eventSchema.index({ type: 1, date: 1, active: 1 })

// Mantener consistencia capacidad ↔ cupos disponibles
eventSchema.pre('validate', function () {
    if (this.availableSpots > this.capacity) {
        this.availableSpots = this.capacity
    }
    if (this.availableSpots === 0) this.active = false
   
})

export default mongoose.model('Event', eventSchema)