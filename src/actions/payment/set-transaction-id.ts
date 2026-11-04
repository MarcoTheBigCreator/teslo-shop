'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { isPayPalOrderId } from '@/lib/payment-validation';

export const setTransactionId = async (orderId: string, transactionId: string) => {
  const session = await auth();
  if (!session?.user?.id || !isPayPalOrderId(transactionId)) {
    return { ok: false, message: 'Unauthorized or invalid transaction ID.' };
  }

  try {
    const result = await prisma.order.updateMany({
      where: { id: orderId, userId: session.user.id, isPaid: false },
      data: { transactionId },
    });
    if (result.count !== 1) {
      return { ok: false, message: 'Order not found or already paid.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error saving transaction ID.' };
  }
};
