'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getPaginatedUsersAdmin = async ({
  page = 1,
  take = 10,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (isNaN(Number(take))) take = 10;
  if (page < 1) page = 1;

  try {
    const session = await auth();

    if (session?.user.role !== 'admin') {
      return { ok: false, message: 'Unauthorized' };
    }

    // 1. Get users
    const users = await prisma.user.findMany({
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        name: 'desc',
      },
    });

    // 2. Get the total pages
    const totalCount = await prisma.user.count();
    const totalPages = Math.ceil(totalCount / take);

    return {
      ok: true,
      totalPages: totalPages,
      users: users,
    };
  } catch (error) {
    throw new Error('No se pudo cargar los productos' + error);
  }
};
