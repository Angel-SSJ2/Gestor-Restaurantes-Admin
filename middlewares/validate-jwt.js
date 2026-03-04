import jwt from 'jsonwebtoken';
import User from '../src/users/user.model.js';

export const validateJwt = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send({ message: 'No proporcionaste un token' });

        token = token.replace(/^Bearer\s+/, "");
        const { id } = jwt.verify(token, process.env.SECRET_KEY || 'Angel2021');

        const user = await User.findById(id);
        
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });
        req.user = user; 
        next();
    } catch (err) {
        console.error("Error en validateJwt:", err.message); 
        return res.status(401).send({ message: 'Token inválido o expirado' });
    }
};