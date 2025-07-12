import { Sales } from '@prisma/client';

export type User = {
    id: number;
    roleId: number;
    name: string;
    surname: string;
    telephone: string | null;
    email: string;
    password: string;
    image: string | null;
    token: string | null;
    isConfirm: boolean;
    status: boolean;
};

export type UserData = Pick<User, 'id' | 'email' | 'status' | 'roleId'>;

export type Product = {
    id?: number;
    code: string;
    name: string;
    categoriesId: number;
    status?: boolean;
};
export type DetailsProducts = {
    id?: number;
    description?: string;
    image?: string;
    products: Product;
};
export type StoredProducts = {
    id?: number;
    stock?: number;
    purchasePrice?: number;
    salePrice?: number;
    status?: boolean;
    detailsProducts: DetailsProducts;
};

//purchases
export type Purchase = {
    id: number;
    usersId: number;
    suppliersId: number;
    iva: 0 | 15;
    invoiceNumber: number;
    document: string | null;
    date: Date;
    subtotal: number;
    discount: number | null;
    total: number;
    status: boolean;
    detailsPurchases: DetailsPurchase[];
};

export type DetailsPurchase = {
    id: number;
    purchasesId: number;
    storedProductsId: number;
    amount: number;
    purchasePrice: number;
    salePrice: number;
    discount: number | null;
    subTotal: number;
};

export type Pagination = {
    take?: number;
    skip?: number;
};

export type OperationType = 'ADD' | 'SUBTRACT';

export type updateStockType = {
    storedProductsId: number;
    amount: number;
    purchasePrice?: number;
    salePrice?: number;
};

export type calculateType = {
    subtotal?: number;
    discount?: number;
    iva?: number;
    amount?: number;
    price?: number;
    purchasePrice?: number;
    salePrice?: number;
};

export enum Role {
    admin = 'administrador',
    employee = 'empleado',
}

// sales
export type Sale = {
    id: number;
    usersId: number;
    paymentMethodId: number;
    bankId?: number | null;
    iva: 0 | 15;
    transactionReference: string | null;
    cancellationReason: string | null;
    annulledAt: Date | null;
    invoiceNumber: number;
    date: Date;
    subtotal: number;
    discount: number | null;
    total: number;
    status: boolean;
    detailsSales: DetailsSale[];
};

export type DetailsSale = {
    id: number;
    salesId: number;
    storedProductsId: number;
    price: number;
    amount: number;
    subtotal: number;
    discount: number | null;
};

export type SuspendSaleType = {
    id: Sales['id'];
    cancellationReason: Sales['cancellationReason'];
};
