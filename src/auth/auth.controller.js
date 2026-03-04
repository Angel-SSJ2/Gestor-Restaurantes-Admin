'use strict'
import User from '../users/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.SECRET_KEY || 'Angel2021';
const JWT_EXPIRES_IN = '3h';

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
            user: { id: newUser._id, email: newUser.email }
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

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.status(200).json({ success: true, token, user: { id: user._id, email: user.email } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('name surname email role phone status')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil',
            error: error.message
        })
    }
}