import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | could not be connected to mongodb');
            mongoose.disconnect();
        });
        mongoose.connection.on('connected', () => console.log('MongoDB | connected to mongodb'));
        mongoose.connection.on('open', () => console.log('MongoDB | connected to database'));

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        });
    } catch (err) {
        console.error('Database connection failed', err);
    }
}