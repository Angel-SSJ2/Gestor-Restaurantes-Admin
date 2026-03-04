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
    stock: { type: Number, required: true, default: 0 },
    available: { type: Boolean, default: true },
    restaurant: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: [true, 'El platillo debe estar asignado a un restaurante'] 
    }
}, { timestamps: true });

export default model('Dish', dishSchema);