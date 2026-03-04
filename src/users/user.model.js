import { Schema, model } from 'mongoose';

const userSchema = Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:{ type: String, required: true },
    role: { 
        type: String, 
        enum: ['ADMIN_PLATFORM', 'ADMIN_RESTAURANT', 'CLIENT'], 
        default: 'CLIENT' 
    },    
    status: { type: Boolean, default: true }
});

export default model('User', userSchema);