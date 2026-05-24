'use strict'

import { Router } from 'express'
import { check } from 'express-validator'
import {
    addDish,
    getDishes,
    updateDish,
    deleteDish
} from './dish.controller.js'
import { validateErrors } from '../../middlewares/validate-errors.js'
import { dishExistsById } from '../../middlewares/db-validators.js'
import { uploadProfilePicture } from '../../middlewares/multer-upload.js'

const api = Router()



// Obtener todos los platillos
api.get('/', getDishes)

//Agregar un nuevo platillo 
api.post('/add', [
    uploadProfilePicture.single('image'),
    check('name', 'El nombre del platillo es obligatorio').not().isEmpty(),
    check('price', 'El precio debe ser un número').isNumeric(),
    validateErrors
], addDish)

// Actualizar un platillo
api.put('/update/:id', [
    uploadProfilePicture.single('image'),
    check('id', 'No es un ID de MongoDB válido').isMongoId(),
    check('id').custom(dishExistsById),
    validateErrors
], updateDish)

// Eliminar un platillo
api.delete('/delete/:id', [
    check('id', 'No es un ID de MongoDB válido').isMongoId(),
    check('id').custom(dishExistsById),
    validateErrors
], deleteDish)

export default api