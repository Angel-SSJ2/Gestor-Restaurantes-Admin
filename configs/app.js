import dotenv from 'dotenv';
dotenv.config();

if (process.env.DISABLE_SSL_VERIFY === 'true'){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

console.log("API KEY:", process.env.CLOUDINARY_API_KEY);


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Rutas
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import restaurantRoutes from '../src/restaurants/restaurant.routes.js';
import dishRoutes from '../src/dishes/dish.routes.js'; 
import orderRoutes from '../src/orders/order.routes.js';
import tableRoutes from '../src/tables/table.routes.js'; 
import reservationRoutes from '../src/reservations/reservation.routes.js'; 
import eventRoutes from '../src/events/event.routes.js';
import billingRoutes from '../src/billing/billing.routes.js';
import inventoryRoutes from '../src/inventory/inventory.routes.js';

import { initializeAdmin } from '../src/utils/admin-setup.js'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Define el prefijo base
const API_PREFIX = '/UrbanCentral/api/v1';

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Aplica el prefijo a todas tus rutas
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/restaurants`, restaurantRoutes);
app.use(`${API_PREFIX}/dishes`, dishRoutes); 
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/tables`, tableRoutes);           
app.use(`${API_PREFIX}/reservations`, reservationRoutes); 
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/billings`, billingRoutes);
app.use(`${API_PREFIX}/inventory`, inventoryRoutes);

initializeAdmin(); 

export default app;