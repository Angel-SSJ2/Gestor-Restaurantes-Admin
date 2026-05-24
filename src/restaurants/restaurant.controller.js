console.log("🚀 CONTROLLER CARGADO");

import Restaurant from './restaurant.model.js';
import { cloudinary, uploadFileToCloudinary } from '../../middlewares/file-uploader.js';

/* =========================
   CONFIG CLOUDINARY (opcional)
========================= */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   SUBIDA A CLOUDINARY
========================= */
// Se usa la función importada de file-uploader.js


/* =========================
   GET ALL (PAGINADO + FILTRO)
========================= */
export const getRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = true } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const statusFilter =
            status === 'true' ? true :
            status === 'false' ? false :
            true;

        const filter = { status: statusFilter };

        const restaurants = await Restaurant.find(filter)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: restaurants,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalRecords: total,
                limit: limitNum,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los restaurantes',
            error: error.message,
        });
    }
};

/* =========================
   GET BY ID
========================= */
export const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el restaurante',
            error: error.message,
        });
    }
};

/* =========================
   CREATE
========================= */
export const addRestaurant = async (req, res) => {
    try {
        const data = req.body;

        const restaurant = new Restaurant({
            name: data.name,
            address: data.address,
            phone: data.phone,
            schedule: data.schedule,
            category: data.category,
        });

        if (req.file && req.file.buffer) {
            const uploadResult = await uploadFileToCloudinary(req.file, 'restaurants');

            restaurant.image = uploadResult.secure_url;
            restaurant.imagePublicId = uploadResult.public_id;
        }

        await restaurant.save();

        res.status(201).json({
            success: true,
            message: 'Restaurante creado exitosamente',
            data: restaurant,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear el restaurante',
            error: error.message,
        });
    }
};

/* =========================
   UPDATE
========================= */
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file && req.file.buffer) {
            const current = await Restaurant.findById(id);

            if (!current) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurante no encontrado',
                });
            }

            // eliminar imagen anterior
            if (current.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(current.imagePublicId);
                } catch (err) {
                    console.error('Error eliminando imagen:', err.message);
                }
            }

            const uploadResult = await uploadFileToCloudinary(req.file, 'restaurants');

            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurante actualizado exitosamente',
            data: restaurant,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el restaurante',
            error: error.message,
        });
    }
};

/* =========================
   DELETE LÓGICO (STATUS)
========================= */
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurante desactivado exitosamente',
            data: restaurant,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el restaurante',
            error: error.message,
        });
    }
};

/* =========================
   SEARCH
========================= */
export const searchRestaurants = async (req, res) => {
    try {
        const { filter } = req.body;

        if (!filter) {
            return res.status(400).json({
                success: false,
                message: 'Filtro es requerido',
            });
        }

        const restaurants = await Restaurant.find({
            status: true,
            $or: [
                { name: { $regex: filter, $options: 'i' } },
                { category: { $regex: filter, $options: 'i' } },
            ],
        });

        res.status(200).json({
            success: true,
            data: restaurants,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda',
            error: error.message,
        });
    }
};