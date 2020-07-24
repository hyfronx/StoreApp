import { Product } from './Product';

export interface OrderProduct {
    productId: number;

    product: Product;

    quantity: number;

    salePrice: number;
}
