'use server';

import { auth } from '@/auth.config';
import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: 'No user session found. Please log in.',
    };
  }

  // get the info of the products
  // note: we can order 2+ products with the same ID but different sizes

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, taxes, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) {
        throw new Error(`${item.productId} not found - 500`);
      }

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.taxes += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, taxes: 0, total: 0 }
  );

  const prismaTx = await prisma.$transaction(async (tx) => {
    // 1. update product stock
    // 2. create order - header - details
    const order = await tx.order.create({
      data: {
        userId: userId,
        itemsInOrder: itemsInOrder,
        subTotal: subTotal,
        taxes: taxes,
        total: total,

        OrderItem: {
          createMany: {
            data: productIds.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              price:
                products.find((product) => product.id === item.productId)
                  ?.price ?? 0,
            })),
          },
        },
      },
    });

    // validate if price is 0, then throw error

    // 3. create order addres
    const { country, ...restAddress } = address;

    const orderAddress = await tx.orderAddress.create({
      data: {
        ...restAddress,
        countryId: country,
        orderId: order.id,
      },
    });

    return {
      updatedProduct: [],
      order: order,
      orderAddress: orderAddress,
    };
  });
};
