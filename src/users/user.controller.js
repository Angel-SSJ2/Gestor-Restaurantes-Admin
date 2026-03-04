import User from './user.model.js';

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User updated', user });
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