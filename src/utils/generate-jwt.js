import jwt from 'jsonwebtoken';

export const generateJwt = (payload) => {
    try {
        return jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '3h'
        });
    } catch (err) {
        console.error(err);
        return null;
    }
};