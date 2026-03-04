import { config } from 'dotenv'; 
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

import { initializeAdmin } from '../src/utils/admin-setup.js'; 

config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/dishes', dishRoutes); 
app.use('/orders', orderRoutes);
app.use('/tables', tableRoutes);           
app.use('/reservations', reservationRoutes); 
app.use('/events', eventRoutes);

initializeAdmin(); 

export default app; 