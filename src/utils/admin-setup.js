import User from '../users/user.model.js';
import bcryptjs from 'bcryptjs';

export const initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'ADMIN_PLATFORM' });

        if (!adminExists) {
            const salt = bcryptjs.genSaltSync();
            const password = bcryptjs.hashSync('Admin', salt);

            const admin = new User({
                name: 'Admin',
                surname: 'Principal',
                email: 'admin@gestor.com',
                password: password,
                phone: '12345678',
                role: 'ADMIN_PLATFORM'
            });

            await admin.save();
            console.log('Admin de plataforma inicializado correctamente');
        } else {
            console.log('El Admin ya existe, saltando inicialización');
        }
    } catch (err) {
        console.error('Error al inicializar el admin:', err);
    }
};