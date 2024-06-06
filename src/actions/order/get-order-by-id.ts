'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: 'No user session found. Please log in.',
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${id} not found - 404`);
    }

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        throw new Error(
          `${session.user.id} is not the owner of the order - 403`
        );
      }
    }

    return {
      ok: true,
      order,
    };
  } catch (error: any) {
    console.log(error);

    return {
      ok: false,
      message: 'Order not found.',
    };
  }
};
