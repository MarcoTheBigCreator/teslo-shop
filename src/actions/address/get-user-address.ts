'use server';

import { auth } from '@/auth.config';

import prisma from '@/lib/prisma';

export const getUserAddress = async (userId: string) => {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) return null;

  try {
    const address = await prisma.userAddress.findFirst({
      where: {
        userId,
      },
    });

    if (!address) {
      return null;
    }

    const { countryId, address2, ...rest } = address;

    return {
      ...rest,
      country: countryId,
      address2: address2 ? address2 : '',
    };
  } catch (error) {
    console.log(error);

    return null;
  }
};
