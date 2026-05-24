import 'dotenv/config'; 
import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tus logs de depuración (Mantenerlos es vital para ver el estado en consola)
console.log("CONFIG CLOUDINARY:", {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("NO SE CARGÓ CLOUDINARY_API_KEY");
}

export const uploadFileToCloudinary = async (file, folder = 'general') => {
    if (!process.env.CLOUDINARY_API_KEY) {
        throw new Error('Cloudinary no está configurado correctamente');
    }

    const fileBase64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${fileBase64}`;

    return cloudinary.uploader.upload(dataUri, {
        folder: folder,
        resource_type: 'image',
    });
};

export { cloudinary };