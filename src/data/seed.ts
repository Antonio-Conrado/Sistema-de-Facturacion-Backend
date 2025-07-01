// import * as bcrypt from 'bcrypt';
// import { Role } from '../types';
// export const seed = {
//     roles: [{ name: Role.admin }, { name: Role.employee }],
//     users: [
//         {
//             name: 'John',
//             surname: 'Doe',
//             telephone: '12345678',
//             email: 'correo@correo.com',
//             password: bcrypt.hashSync('Abc123', 10),
//             isConfirm: true,
//             roleId: 1,
//         },
//         {
//             name: 'Nicole',
//             surname: 'Vach',
//             telephone: '12345678',
//             email: 'correo1@correo.com',
//             password: bcrypt.hashSync('Abc123', 10),
//             isConfirm: true,
//             roleId: 2,
//         },
//     ],
//     suppliers: [
//         {
//             ruc: '1234567890123',
//             name: 'General',
//             direction: 'Dirección del proveedor',
//             telephone: '987654321',
//             email: 'proveedor@correo.com',
//         },
//     ],
//     iva: [
//         {
//             rate: 15,
//         },
//     ],
//     paymentMethods: [
//         {
//             name: 'Efectivo',
//         },
//         {
//             name: 'Transferencia Bancaria',
//         },
//     ],
//     businessData: [
//         {
//             ruc: '9876543210987',
//             name: 'Mi negocio',
//             description: 'descripción del negocio',
//             direction: 'dirección de negocio',
//             telephone: '111222333',
//             email: 'contacto@correo.com',
//         },
//     ],
// };

import * as bcrypt from 'bcrypt';
import { Role } from '../types';
import { PaymentMethods } from './data';

export const seed = {
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
            image: 'https://example.com/images/smartphone.jpg',
        },
        {
            productsId: 2,
            description: 'Ergonomic office chair',
            image: 'https://example.com/images/office-chair.jpg',
        },
        {
            productsId: 3,
            description: '100% cotton T-Shirt',
            image: 'https://example.com/images/tshirt.jpg',
        },
    ],
    storedProducts: [
        {
            detailsProductsId: 1,
            stock: 100,
            purchasePrice: 300,
            salePrice: 450,
            status: true,
        },
        {
            detailsProductsId: 2,
            stock: 50,
            purchasePrice: 75,
            salePrice: 120,
            status: true,
        },
        {
            detailsProductsId: 3,
            stock: 200,
            purchasePrice: 10,
            salePrice: 20,
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
            subtotal: 500,
            discount: 50,
            total: 517.5, // subtotal - discount + iva (15%)
            status: true,
        },
        {
            usersId: 2,
            suppliersId: 1,
            iva: 15,
            invoiceNumber: 1002,
            document: null,
            date: new Date('2025-06-30T11:00:00Z'),
            subtotal: 1000,
            discount: 100,
            total: 945,
            status: true,
        },
    ],
    detailsPurchases: [
        {
            purchasesId: 1,
            storedProductsId: 1,
            amount: 1,
            purchasePrice: 300,
            salePrice: 450,
            discount: 0,
            subtotal: 300,
        },
        {
            purchasesId: 1,
            storedProductsId: 3,
            amount: 10,
            purchasePrice: 10,
            salePrice: 20,
            discount: 10,
            subtotal: 100,
        },
        {
            purchasesId: 2,
            storedProductsId: 2,
            amount: 5,
            purchasePrice: 75,
            salePrice: 120,
            discount: 50,
            subtotal: 375,
        },
        {
            purchasesId: 2,
            storedProductsId: 3,
            amount: 20,
            purchasePrice: 10,
            salePrice: 20,
            discount: 50,
            subtotal: 200,
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
            subtotal: 600,
            discount: 30,
            total: 613.5,
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
            subtotal: 1200,
            discount: 60,
            total: 1221,
            status: true,
        },
    ],
    detailsSales: [
        {
            salesId: 1,
            storedProductsId: 1,
            price: 450,
            amount: 1,
            subtotal: 450,
            discount: 0,
        },
        {
            salesId: 1,
            storedProductsId: 3,
            price: 20,
            amount: 5,
            subtotal: 100,
            discount: 30,
        },
        {
            salesId: 2,
            storedProductsId: 2,
            price: 120,
            amount: 5,
            subtotal: 600,
            discount: 60,
        },
        {
            salesId: 2,
            storedProductsId: 3,
            price: 20,
            amount: 15,
            subtotal: 300,
            discount: 0,
        },
    ],
};
