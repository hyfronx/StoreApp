import { Order } from './Order';

export interface Costumer {
    id: number;

    cnpj: string;

    companyName: string;

    orders: Order[];
}
