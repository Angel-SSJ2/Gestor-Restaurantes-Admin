import { Schema, model } from 'mongoose';

const dishSchema = Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['entrada', 'plato fuerte', 'bebida', 'postre']
    },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    stock: { type: Number, default: 99 },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Dish', dishSchema);