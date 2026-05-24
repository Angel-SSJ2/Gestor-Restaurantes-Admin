import { Schema, model } from 'mongoose';

const restaurantSchema = Schema({
    name: { type: String, required: [true, 'El nombre del restaurante es obligatorio'], unique: true },
    address: { type: String, required: [true, 'La direccion es obligatoria'] },
    phone: { type: String, required: true },
    schedule: { type: String, required: true },
    category: { type: String, required: [true, 'La categoria es obligatoria'] },
    status: { type: Boolean, default: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);