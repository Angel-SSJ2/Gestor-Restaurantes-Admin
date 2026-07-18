import User from './user.model.js';
import bcrypt from 'bcryptjs';

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.newPassword) {
            if (!data.currentPassword) {
                return res.status(400).send({ message: 'Debe proporcionar su contraseña actual' });
            }
            const user = await User.findById(id);
            if (!user || !(await bcrypt.compare(data.currentPassword, user.password))) {
                return res.status(400).send({ message: 'La contraseña actual es incorrecta' });
            }
            data.password = await bcrypt.hash(data.newPassword, 10);
        }
        
        // Remove fields that shouldn't be blindly updated
        delete data.currentPassword;
        delete data.newPassword;

        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });
        return res.send({ message: 'Usuario actualizado', user });
    } catch (err) {
        return res.status(500).send({ message: 'Error updating user', err });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User deleted' });
    } catch (err) {
        return res.status(500).send({ message: 'Error deleting user', err });
    }
};

export const list = async (req, res) => { 
    try {
        const users = await User.find();
        res.send({ success: true, users });
    } catch (err) {
        res.status(500).send({ message: 'Error al listar usuarios' });
    }
};