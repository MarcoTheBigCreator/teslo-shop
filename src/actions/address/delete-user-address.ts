'use server';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
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
