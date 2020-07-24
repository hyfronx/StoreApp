import { OrderProduct } from './OrderProduct';
import { Costumer } from './Costumer';


export interface Order {

    id: number;

    date: Date;

    totalPurchaseAmount: number;

    costumerId: number;

    costumer: Costumer;

    sellerUser: string;

    orderProducts: OrderProduct[];
}
