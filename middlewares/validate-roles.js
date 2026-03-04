export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN_PLATFORM') { 
        next();
    } else {
        return res.status(403).send({ message: 'Acceso denegado: Se requieren permisos de Administrador' });
    }
};

export const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send({ message: 'No tienes el rol necesario para esta acción' });
        }
        next();
    };
};