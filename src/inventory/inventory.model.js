import { Schema, model } from 'mongoose';

const inventorySchema = Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { 
        type: String, 
        required: true, 
        enum: ['UNIDAD', 'KG', 'LITRO', 'CAJA'], 
        default: 'UNIDAD' 
    },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    location: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Inventory', inventorySchema);
