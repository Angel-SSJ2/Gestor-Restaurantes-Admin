import { Schema, model } from 'mongoose';

const branchSchema = Schema({
    name: { type: String, required: [true, 'El nombre de la sucursal es obligatorio'] },
    address: { type: String, required: [true, 'La dirección es obligatoria'] },
    phone: { type: String },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio']
    },
    status: { type: Boolean, default: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
}, { timestamps: true });

export default model('Branch', branchSchema);