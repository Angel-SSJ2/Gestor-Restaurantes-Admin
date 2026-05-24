import Dish from './dish.model.js';
import { cloudinary, uploadFileToCloudinary } from '../../middlewares/file-uploader.js';

// CREATE El Admin crea un platillo para un restaurante específico
export const addDish = async (req, res) => {
    try {
        const data = req.body;
        const dish = new Dish(data);

        if (req.file && req.file.buffer) {
            const uploadResult = await uploadFileToCloudinary(req.file, 'dishes');
            dish.image = uploadResult.secure_url;
            dish.imagePublicId = uploadResult.public_id;
        }

        await dish.save();

        res.status(201).send({ success: true, message: 'Dish added to menu', dish });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error adding dish', err: err.message });
    }
};
// READ Obtener todos los platillos
export const getDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        if (dishes.length === 0) {
            return res.status(404).send({ message: 'No dishes found' });
        }
        res.send({ success: true, dishes });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error fetching dishes', err: err.message });
    }
};


// UPDATE El Admin edita un platillo
export const updateDish = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send({ success: false, message: 'No hay datos para actualizar el platillo' });
        }

        if (data._id) delete data._id;

        if (req.file && req.file.buffer) {
            const current = await Dish.findById(id);
            if (!current) return res.status(404).send({ message: 'Dish not found' });

            if (current.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(current.imagePublicId);
                } catch (err) {
                    console.error('Error deleting old image:', err.message);
                }
            }

            const uploadResult = await uploadFileToCloudinary(req.file, 'dishes');
            data.image = uploadResult.secure_url;
            data.imagePublicId = uploadResult.public_id;
        }

        const updatedDish = await Dish.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            context: 'query'
        });
        if (!updatedDish) return res.status(404).send({ message: 'Dish not found' });

        res.send({ success: true, message: 'Dish updated', updatedDish });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error updating dish', err: err.message });
    }
};

// DELETE Borrado físico o lógico
export const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDish = await Dish.findByIdAndDelete(id);
        if (!deletedDish) return res.status(404).send({ message: 'Dish not found' });

        res.send({ success: true, message: 'Dish removed from menu' });
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error deleting dish', err: err.message });
    }
};