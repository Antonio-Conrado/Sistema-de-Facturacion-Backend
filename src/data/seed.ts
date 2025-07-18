import * as bcrypt from 'bcrypt';
import { Role } from '../types';
import { PaymentMethods } from './data';

export const basicSeed = {
    roles: [
        { name: Role.admin, status: true },
        { name: Role.employee, status: true },
    ],
    users: [
        {
            name: 'John',
            surname: 'Doe',
            telephone: '12345678',
            email: 'correo@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            status: true,
            roleId: 1,
        },
        {
            name: 'Nicole',
            surname: 'Vach',
            telephone: '12345678',
            email: 'correo1@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            status: true,
            roleId: 2,
        },
    ],
    suppliers: [
        {
            ruc: '1234567890123',
            name: 'General Supplier',
            direction: 'Dirección del proveedor',
            telephone: '987654321',
            email: 'proveedor@correo.com',
            status: true,
        },
    ],
    paymentMethods: [
        { name: PaymentMethods.cash, status: true },
        { name: PaymentMethods.bankTransfer, status: true },
    ],
    businessData: [
        {
            ruc: '9876543210987',
            name: 'Mi negocio',
            description: 'Descripción del negocio',
            direction: 'Dirección de negocio',
            telephone: '111222333',
            email: 'contacto@correo.com',
            image: null,
        },
    ],
};

export const fullSeed = {
    roles: [
        { name: Role.admin, status: true },
        { name: Role.employee, status: true },
    ],
    users: [
        {
            name: 'John',
            surname: 'Doe',
            telephone: '12345678',
            email: 'correo@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            status: true,
            roleId: 1,
        },
        {
            name: 'Nicole',
            surname: 'Vach',
            telephone: '12345678',
            email: 'correo1@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            status: true,
            roleId: 2,
        },
    ],
    suppliers: [
        {
            ruc: '1234567890123',
            name: 'General Supplier',
            direction: 'Dirección del proveedor',
            telephone: '987654321',
            email: 'proveedor@correo.com',
            status: true,
        },
    ],
    paymentMethods: [
        { name: PaymentMethods.cash, status: true },
        { name: PaymentMethods.bankTransfer, status: true },
    ],
    businessData: [
        {
            ruc: '9876543210987',
            name: 'Mi negocio',
            description: 'Descripción del negocio',
            direction: 'Dirección de negocio',
            telephone: '111222333',
            email: 'contacto@correo.com',
            image: null,
        },
    ],
    categories: [
        {
            name: 'Electronics',
            description: 'Electronic products and gadgets',
            status: true,
        },
        {
            name: 'Furniture',
            description: 'Furniture for homes and offices',
            status: true,
        },
        { name: 'Clothing', description: 'Apparel and garments', status: true },
    ],
    products: [
        { code: 'P001', name: 'Smartphone', categoriesId: 1, status: true },
        { code: 'P002', name: 'Office Chair', categoriesId: 2, status: true },
        { code: 'P003', name: 'T-Shirt', categoriesId: 3, status: true },
    ],
    detailsProducts: [
        {
            productsId: 1,
            description: 'Latest model smartphone',
            image: 'https://imgs.search.brave.com/QWIfW7hmRAoPaQq2UmfKSGRI_tOtndZExXFpP7tbNLQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF82MTI4NTgt/TUxNNzk1NjA5MDc3/OTRfMTAyMDI0LU8t/c2Ftc3VuZy1nYWxh/eHktczI0LWZlLWR1/YWwtMjU2Z2ItOHJh/bS1taW50LndlYnA',
        },
        {
            productsId: 2,
            description: 'Ergonomic office chair',
            image: 'https://imgs.search.brave.com/9dkP2UgyQVUkiFcqJ3eciUrAYhcnTUouudyZhjGxdsY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9z/dGlsbC1saWZlLW9m/ZmljZS1jaGFpci1p/bmRvb3JzXzIzLTIx/NTExMDg3MjguanBn/P3NlbXQ9YWlzX2h5/YnJpZCZ3PTc0MA',
        },
        {
            productsId: 3,
            description: '100% cotton T-Shirt',
            image: 'https://imgs.search.brave.com/onzM7M_rW0DJvbrKLScyZBeYTX7HhUay4bTfLviXr5c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyNC8w/NC8xNy8xOC80MC9h/aS1nZW5lcmF0ZWQt/ODcwMjcyNl82NDAu/anBn',
        },
    ],
    storedProducts: [
        {
            detailsProductsId: 1,
            stock: 100,
            purchasePrice: 5200,
            salePrice: 6200,
            status: true,
        },
        {
            detailsProductsId: 2,
            stock: 50,
            purchasePrice: 8000,
            salePrice: 8500,
            status: true,
        },
        {
            detailsProductsId: 3,
            stock: 200,
            purchasePrice: 200,
            salePrice: 320,
            status: true,
        },
    ],
    purchases: [
        {
            usersId: 1,
            suppliersId: 1,
            iva: 15,
            invoiceNumber: 1001,
            document: null,
            date: new Date('2025-06-30T10:00:00Z'),
            subtotal: 136000, // 5200 * 10 + 8000 * 5
            discount: 2000,
            total: 136700, // (subtotal - discount) + IVA 15%
            status: true,
        },
        {
            usersId: 2,
            suppliersId: 1,
            iva: 15,
            invoiceNumber: 1002,
            document: null,
            date: new Date('2025-06-30T11:00:00Z'),
            subtotal: 64000, // 320 * 200
            discount: 0,
            total: 73600, // subtotal + IVA 15%
            status: true,
        },
    ],
    detailsPurchases: [
        {
            purchasesId: 1,
            storedProductsId: 1,
            amount: 10,
            purchasePrice: 5200,
            salePrice: 6200,
            discount: 0,
            subtotal: 52000, // 10 * 5200
        },
        {
            purchasesId: 1,
            storedProductsId: 2,
            amount: 5,
            purchasePrice: 8000,
            salePrice: 8500,
            discount: 2000,
            subtotal: 40000, // 5 * 8000
        },
        {
            purchasesId: 2,
            storedProductsId: 3,
            amount: 200,
            purchasePrice: 200,
            salePrice: 320,
            discount: 0,
            subtotal: 40000, // 200 * 200
        },
    ],
    sales: [
        {
            usersId: 1,
            paymentMethodId: 1,
            iva: 15,
            transactionReference: 'TX123456',
            cancellationReason: null,
            annulledAt: null,
            invoiceNumber: 5001,
            date: new Date('2025-07-01T10:00:00Z'),
            subtotal: 62000, // 10 * 6200
            discount: 2000,
            total: 61230, // (subtotal - discount) + IVA 15%
            status: true,
        },
        {
            usersId: 2,
            paymentMethodId: 2,
            iva: 15,
            transactionReference: 'TX123457',
            cancellationReason: null,
            annulledAt: null,
            invoiceNumber: 5002,
            date: new Date('2025-07-01T11:00:00Z'),
            subtotal: 54400, // 5 * 8500 + 15 * 320
            discount: 0,
            total: 62560, // subtotal + IVA 15%
            status: true,
        },
    ],
    detailsSales: [
        {
            salesId: 1,
            storedProductsId: 1,
            price: 6200,
            amount: 10,
            subtotal: 62000, // 10 * 6200
            discount: 0,
        },
        {
            salesId: 1,
            storedProductsId: 2,
            price: 8500,
            amount: 1,
            subtotal: 8500,
            discount: 2000,
        },
        {
            salesId: 2,
            storedProductsId: 2,
            price: 8500,
            amount: 5,
            subtotal: 42500,
            discount: 0,
        },
        {
            salesId: 2,
            storedProductsId: 3,
            price: 320,
            amount: 15,
            subtotal: 4800,
            discount: 0,
        },
    ],
};
