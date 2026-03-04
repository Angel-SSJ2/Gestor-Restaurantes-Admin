'use strict'

import { Router } from 'express'
import { check } from 'express-validator'
import { 
    addDish,      
    getMenuByRestaurant,   
    updateDish, 
    deleteDish 
} from './dish.controller.js'
import { validateJwt } from '../../middlewares/validate-jwt.js'
import { isAdmin } from '../../middlewares/validate-roles.js'
import { validateErrors } from '../../middlewares/validate-errors.js'
import { dishExistsById, restaurantExistsById } from '../../middlewares/db-validators.js'

const api = Router()

// Obtener el menú de un restaurante específico 
api.get('/restaurant/:restaurantId', [
    check('restaurantId', 'No es un ID de MongoDB válido').isMongoId(),
    check('restaurantId').custom(restaurantExistsById),
    validateErrors
], getMenuByRestaurant)

//Agregar un nuevo platillo 
api.post('/add', [
    validateJwt,
    isAdmin,
    check('name', 'El nombre del platillo es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser un número').isNumeric(),
    check('restaurant', 'El ID del restaurante es obligatorio').isMongoId(),
    check('restaurant').custom(restaurantExistsById),
    validateErrors
], addDish)

// Actualizar un platillo
api.put('/update/:id', [
    validateJwt,
    isAdmin,
    check('id', 'No es un ID de MongoDB válido').isMongoId(),
    check('id').custom(dishExistsById),
    validateErrors
], updateDish)

// Eliminar un platillo
api.delete('/delete/:id', [
    validateJwt,
    isAdmin,
    check('id', 'No es un ID de MongoDB válido').isMongoId(),
    check('id').custom(dishExistsById),
    validateErrors
], deleteDish)

export default api