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
    stock: number;
    purchasePrice: number;
    salePrice: number;
    status?: boolean;
    detailsProducts: DetailsProducts;
};
