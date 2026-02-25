import { db } from "@/lib/db";

export const getStockCount = async(storeId: string) => {
    const products = await db.product.findMany({
        where: {
            storeId,
            isArchived: false
        },
        select: {
            quantity: true
        }
    });

    const stockCount = products.reduce((total, product) => total + product.quantity, 0);
    
    return stockCount;
}