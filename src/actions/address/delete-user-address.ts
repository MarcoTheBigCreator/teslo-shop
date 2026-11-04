'use server';

import { auth } from '@/auth.config';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) return { ok: false, message: 'Unauthorized' };

  try {
    const addressToRemove = await prisma.userAddress.delete({
      where: {
        userId,
      },
    });

    return {
      ok: true,
      address: addressToRemove,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'The address could not be deleted. Please try again later.',
    };
  }
};
