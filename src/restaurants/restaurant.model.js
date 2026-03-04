import { Schema, model } from 'mongoose';

const restaurantSchema = Schema({
    name: { type: String, required: [true, 'El nombre del restaurante es obligatorio'], unique: true },
    address: { type: String, required: [true, 'La direccion es obligatoria'] },
    category: { type: String, required: [true, 'La categoria es obligatoria'] }, 
    openingHours: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    status: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);