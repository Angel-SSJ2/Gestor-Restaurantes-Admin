import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log('Successfully dropped username_1 index');
        } catch (error) {
            console.log('Error dropping index (it may not exist):', error.message);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
