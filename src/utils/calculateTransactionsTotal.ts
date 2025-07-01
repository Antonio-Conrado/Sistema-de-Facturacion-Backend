import { calculateType } from '../types';

// This function helps calculate the subtotal for a single item in a detailsPurchase or detailsSale.
export const calculateDetailSubtotal = ({
    price,
    amount,
    discount,
}: calculateType) => {
    const subtotalItem = price * amount;
    const discountItem = discount ? subtotalItem * (discount / 100) : 0;
    const subtotalValue = subtotalItem - discountItem;
    return {
        subtotalValue,
    };
};

// This function calculates the total of a purchase or sale, considering the subtotal, discount and iva.
export const calculateTotal = ({ subtotal, discount, iva }: calculateType) => {
    const discountTotal = subtotal * (discount / 100);
    const subtotalWithDiscount = subtotal - discountTotal;
    const ivaTotal = subtotalWithDiscount * (iva / 100);

    const totalValue = subtotalWithDiscount + ivaTotal;
    return {
        subtotal,
        totalValue,
    };
};

// This function calculates the total of a transaction (purchase or sale) from item details, considering iva and a general discount.
export const calculateTotalFromDetails = (
    value: calculateType[],
    iva: number,
    discount: number,
) => {
    // Calculate the subtotal for each item (product) using its price and discount.
    const subtotalDetailsGeneral = value.reduce(
        (total, item) =>
            total +
            calculateDetailSubtotal({
                price: item.purchasePrice ?? item.price,
                amount: item.amount,
                discount: item.discount,
            }).subtotalValue,
        0,
    );

    // Calculate the total using the subtotalDetailsGeneral for the final total calculation.
    const calculatedTotal = calculateTotal({
        subtotal: subtotalDetailsGeneral,
        discount: discount,
        iva: iva,
    });

    return calculatedTotal;
};
