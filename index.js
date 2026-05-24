import dotenv from 'dotenv';


import app from "./configs/app.js";
import { dbConnection } from "./configs/db.js";
console.log("TEST ENV:", process.env.CLOUDINARY_API_KEY);

dotenv.config();

if(process.env.DISABLE_SSL_VERIFY === 'true'){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const startServer = async () => {
    try {
        await dbConnection();
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`servidor corriendo en el puerto ${port}`);
            console.log(`URL base: http://localhost:${port}/UrbanCentral/api/v1/`)
        });
    } catch (err) {
        console.error(' fallo a correr servidor:', err);
    }
};

startServer();