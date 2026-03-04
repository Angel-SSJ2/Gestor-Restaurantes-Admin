'use strict'

import User from '../src/users/user.model.js'
import Event from '../src/events/event.model.js'
import Table from '../src/tables/table.model.js'
import Reservation from '../src/reservations/reservation.model.js'
import Restaurant from '../src/restaurants/restaurant.model.js'
import Dish from '../src/dishes/dish.model.js' 
import Order from '../src/orders/order.model.js'

// -------------------- USERS --------------------

// validar si un email ya está registrado
export const emailExists = async (email = '') => {
    const user = await User.findOne({ email })
    if (user) throw new Error(`El correo ${email} ya está registrado`)
}

// validar existencia de usuario por ID
export const userExistsById = async (id) => {
    const user = await User.findById(id)
    if (!user) throw new Error(`No existe usuario con ID ${id}`)
}

// -------------------- EVENTS --------------------
export const eventExistsById = async (id) => {
    const event = await Event.findById(id)
    if (!event) throw new Error(`No existe evento con ID ${id}`)
}

// -------------------- TABLES --------------------
export const tableExistsById = async (id) => {
    const table = await Table.findById(id)
    if (!table) throw new Error(`No existe mesa con ID ${id}`)
}

// -------------------- RESERVATIONS --------------------

// validar existencia de reserva por ID
export const reservationExistsById = async (id) => {
    const reservation = await Reservation.findById(id)
    if (!reservation) throw new Error(`No existe reserva con ID ${id}`)
}

// validar que una mesa no tenga otra reserva a la misma hora
export const tableAvailable = async (tableId, date) => {
    const existing = await Reservation.findOne({ table: tableId, date: date });
    if (existing) throw new Error(`La mesa ya está ocupada en esa fecha/hora`);
};

// -------------------- RESTAURANTS --------------------
export const restaurantExistsById = async (id) => {
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) throw new Error(`No existe restaurante con ID ${id}`)
}

// -------------------- Dishes --------------------
export const dishExistsById = async (id) => {
    const dish = await Dish.findById(id);
    if (!dish) throw new Error(`No existe el platillo con ID ${id}`);
};

// -------------------- ORDERS --------------------
export const orderExistsById = async (id) => {
    const order = await Order.findById(id)
    if (!order) throw new Error(`No existe pedido con ID ${id}`)
}

// validar que el estado del pedido sea válido
export const validOrderStatus = (status) => {
    const validStatuses = ['Pendiente', 'Preparando', 'Entregado']
    if (!validStatuses.includes(status)) {
        throw new Error(`Estado de pedido inválido: ${status}`)
    }
}