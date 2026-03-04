import { config } from "dotenv";
import app from "./configs/app.js"; 
import { dbConnection } from "./configs/db.js"; 

config();

const startServer = async () => {
    try {
        await dbConnection(); 
        const port = process.env.PORT || 3000;
        
        app.listen(port, () => { 
            console.log(`servidor corriendo en el puerto ${port}`);
            console.log(`URL base: http://localhost:${port}`)
        });
    } catch (err) {
        console.error(' fallo a correr servidor:', err);
    }
};

startServer();