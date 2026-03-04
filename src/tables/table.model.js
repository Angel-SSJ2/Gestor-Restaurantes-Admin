'use strict'

import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio']
    },
    number: {
        type: Number,
        required: [true, 'El número de mesa es obligatorio'],
        min: [1, 'El número debe ser mayor a 0']
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [1, 'Debe haber al menos 1 asiento']
    },
    status: {
        type: String,
        enum: ['disponible', 'ocupada', 'reservada', 'inactiva'],
        default: 'disponible'
    }
}, { timestamps: true })

// Evita duplicar número de mesa en el mismo restaurante
tableSchema.index({ restaurant: 1, number: 1 }, { unique: true })

export default mongoose.model('Table', tableSchema)