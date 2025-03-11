import { Iva } from '@prisma/client';
import { calculateType } from '../types';

// This function helps calculate the subtotal for a single item in a detailsPurchase or detailsSale.
export const calculateDetailSubtotal = ({
    price,
    amount,
    discount,
}: calculateType) => {
    const subtotalItem = price * amount;
    const discountItem = discount ? (subtotalItem * discount) / 100 : 0;
    const subtotalValue = subtotalItem - discountItem;
    return {
        subtotalValue,
    };
};

// This function calculates the total of a purchase or sale, considering the subtotal, discount and iva.
export const calculateTotal = ({ subtotal, discount, iva }: calculateType) => {
    const subtotalValue = discount
        ? subtotal - (subtotal * discount) / 100
        : subtotal;
    const ivaValue = iva ? (subtotalValue * iva) / 100 : 0;

    const totalValue = subtotalValue + ivaValue;
    return {
        subtotalValue,
        totalValue,
    };
};

// This function calculates the total of a transaction (purchase or sale) from item details, considering iva and a general discount.
export const calculateTotalFromDetails = (
    value: calculateType[],
    iva: Iva,
    discount: number,
) => {
    // Calculate the subtotal for each item (product) using its price and discount.
    const subtotalDetailsGeneral = value.reduce(
        (total, item) =>
            total +
            calculateDetailSubtotal({
                price: item.purchasePrice,
                amount: item.amount,
                discount: item.discount,
            }).subtotalValue,
        0,
    );

    // Calculate the total using the subtotalDetailsGeneral for the final total calculation.
    const calculatedTotal = calculateTotal({
        subtotal: subtotalDetailsGeneral,
        discount: discount,
        iva: iva.rate,
    });

    return calculatedTotal;
};
