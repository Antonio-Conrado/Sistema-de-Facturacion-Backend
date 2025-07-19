import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL];
        if (!origin) {
            return callback(null, true);
        }

        if (whiteList.includes(origin)) {
            return callback(null, true);
        } else {
            callback(new Error('Error de CORS '));
        }
    },
};
