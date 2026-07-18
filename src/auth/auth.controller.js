'use strict'
import User from '../users/user.model.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    try {
        const { name, surname, email, password, phone, role } = req.body

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'El correo electrónico ya está registrado' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            surname,
            email,
            password: hashedPassword,
            phone,
            role
        })

        res.status(201).json({
            success: true,
            message: 'Usuario registrado',
            user: { 
                id: newUser._id, 
                _id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' })
        }

        res.status(200).json({ 
            success: true, 
            message: `Bienvenido ${user.name}`,
            user: { 
                id: user._id,
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone,
                role: user.role 
            } 
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await User.findById(id).select('name surname email role phone status');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil',
            error: error.message
        });
    }
}