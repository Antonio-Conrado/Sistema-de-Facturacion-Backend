import {rateLimit} from 'express-rate-limit'

export const limiterRequest = rateLimit({
    windowMs: 60* 3000,
    limit: 5,
    message: {'error': 'Has alcanzado el límite de peticiones. Intenta nuevamente dentro de 3 minutos'}
})
