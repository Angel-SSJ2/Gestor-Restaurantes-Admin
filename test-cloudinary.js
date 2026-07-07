import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadTest = async () => {
    try {
        console.log("Starting upload test...");
        // 1x1 pixel transparent GIF base64
        const dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'test',
            resource_type: 'image',
        });
        
        console.log("Upload successful:", result.secure_url);
    } catch (err) {
        console.error("Upload failed:", err);
    }
};

uploadTest();
