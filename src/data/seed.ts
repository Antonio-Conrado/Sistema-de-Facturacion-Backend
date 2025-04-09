import * as bcrypt from 'bcrypt';
export const seed = {
    roles: [{ name: 'adminstrador' }, { name: 'empleado' }],
    users: [
        {
            name: 'John',
            surname: 'Doe',
            telephone: '12345678',
            email: 'correo@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            roleId: 1,
        },
        {
            name: 'Nicole',
            surname: 'Vach',
            telephone: '12345678',
            email: 'correo1@correo.com',
            password: bcrypt.hashSync('Abc123', 10),
            isConfirm: true,
            roleId: 2,
        },
    ],
    suppliers: [
        {
            ruc: '1234567890123',
            name: 'General',
            direction: 'Dirección del proveedor',
            telephone: '987654321',
            email: 'proveedor@correo.com',
        },
    ],
    iva: [
        {
            rate: 15,
        },
    ],
    paymentMethods: [
        {
            name: 'Efectivo',
        },
        {
            name: 'Transferencia Bancaria',
        },
    ],
    businessData: [
        {
            ruc: '9876543210987',
            name: 'Mi negocio',
            description: 'descripción del negocio',
            direction: 'dirección de negocio',
            telephone: '111222333',
            email: 'contacto@correo.com',
        },
    ],
};
