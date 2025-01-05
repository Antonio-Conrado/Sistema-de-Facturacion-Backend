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
}

export type UserData = Pick<User, 'id' | 'email' | 'status' | 'roleId'>