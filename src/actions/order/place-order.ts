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

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. update product stock
      const updatedProductPromises = products.map((product) => {
        // get the quantity of the product in the order
        const productQuantity = productIds
          .filter((item) => item.productId === product.id)
          .reduce((count, item) => count + item.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`Product ${product.id} has a quantity of 0`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductPromises);

      // verify negative stock = not enough stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`Not enough stock for product ${product.title}`);
        }
      });

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
        updatedProduct: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
