export class Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    discount_amount: number;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    categories: Array<number>
}