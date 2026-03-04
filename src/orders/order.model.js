import { Schema, model } from 'mongoose';

const orderSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        dish: { type: Schema.Types.ObjectId, ref: 'Dish', required: true }, 
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['PENDIENTE', 'PREPARANDO', 'ENTREGADO', 'CANCELADO'], 
        default: 'PENDIENTE' 
    }
}, { timestamps: true });

export default model('Order', orderSchema);