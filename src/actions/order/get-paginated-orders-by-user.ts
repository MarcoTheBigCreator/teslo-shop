'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedOrdersByUser = async ({
  page = 1,
  take = 10,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (isNaN(Number(take))) take = 10;
  if (page < 1) page = 1;

  try {
    const session = await auth();

    if (!session) {
      return { ok: false, message: 'Unauthorized' };
    }

    // 1. Get orders of the user
    const orders = await prisma.order.findMany({
      take: take,
      skip: (page - 1) * take,
      where: {
        userId: session.user.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // 2. Get the total pages
    const totalCount = await prisma.order.count();
    const totalPages = Math.ceil(totalCount / take);

    return {
      ok: true,
      totalPages: totalPages,
      orders: orders,
    };
  } catch (error) {
    throw new Error('No se pudo cargar los productos' + error);
  }
};
