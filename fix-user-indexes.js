import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para arreglar índices de usuarios');

        const collection = mongoose.connection.collection('users');
        
        console.log('Listando índices actuales...');
        const indexes = await collection.indexes();
        console.log(indexes.map(i => i.name));

        try {
            console.log('Intentando borrar el índice username_1...');
            await collection.dropIndex('username_1');
            console.log('Índice username_1 borrado con éxito');
        } catch (err) {
            console.log('No se pudo borrar username_1 o no existe:', err.message);
        }

        console.log('Proceso finalizado.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
};

fixIndexes();
