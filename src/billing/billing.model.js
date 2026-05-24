import { Schema, model } from 'mongoose';

const billingSchema = Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    amount: { type: Number, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['EFECTIVO', 'TARJETA'], 
        required: true 
    },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' }
}, { timestamps: true });

export default model('Billing', billingSchema);
