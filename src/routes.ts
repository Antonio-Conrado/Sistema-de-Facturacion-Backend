import { Express } from 'express';
import seed from './routes/seed';
import auth from './routes/auth';
import user from './routes/user';
import category from './routes/category';
import supplier from './routes/supplier';
import bank from './routes/bank';
import product from './routes/product';
import businessData from './routes/businessData';
import paymentMethod from './routes/paymentMethod';
import purchase from './routes/purchase';
import sale from './routes/sale';
import dashboard from './routes/dashboard';

const routes = (app: Express) => {
    app.use('/api/v1/seed', seed);

    app.use('/api/v1/auth', auth);
    app.use('/api/v1/user', user);
    app.use('/api/v1/categories', category);
    app.use('/api/v1/suppliers', supplier);
    app.use('/api/v1/banks', bank);
    app.use('/api/v1/products', product);
    app.use('/api/v1/businessData', businessData);
    app.use('/api/v1/payment-methods', paymentMethod);
    app.use('/api/v1/purchases', purchase);
    app.use('/api/v1/sales', sale);
    app.use('/api/v1/dashboard', dashboard);
};
export default routes;
