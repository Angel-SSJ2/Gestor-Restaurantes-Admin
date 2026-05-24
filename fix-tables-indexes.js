import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const collection = mongoose.connection.collection('tables');
        
        console.log('Listando índices actuales...');
        const indexes = await collection.indexes();
        console.log(indexes);

        // Intentar borrar el índice problemático
        try {
            console.log('Intentando borrar el índice branch_1_number_1...');
            await collection.dropIndex('branch_1_number_1');
            console.log('Índice branch_1_number_1 borrado con éxito');
        } catch (err) {
            console.log('No se pudo borrar branch_1_number_1 o no existe:', err.message);
        }

        // También borrar restaurant_1_number_1 por si acaso para que se recree limpio
        try {
            await collection.dropIndex('restaurant_1_number_1');
            console.log('Índice restaurant_1_number_1 borrado para recreación');
        } catch (err) {
            console.log('No se pudo borrar restaurant_1_number_1:', err.message);
        }

        console.log('Proceso finalizado. Reinicia el servidor para que Mongoose recree los índices correctos.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

fixIndexes();
