import { Express } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import category from './routes/category';
import supplier from './routes/supplier';
import product from './routes/product';
import businessData from './routes/businessData';
import iva from './routes/iva';
import paymentMethod from './routes/paymentMethod';
import purchase from './routes/purchase';

const routes = (app: Express) => {
    app.use('/api/v1/auth', auth);
    app.use('/api/v1/user', user);
    app.use('/api/v1/categories', category);
    app.use('/api/v1/suppliers', supplier);
    app.use('/api/v1/products', product);
    app.use('/api/v1/businessData', businessData);
    app.use('/api/v1/iva', iva);
    app.use('/api/v1/payment-methods', paymentMethod);
    app.use('/api/v1/purchases', purchase);
};
export default routes;
