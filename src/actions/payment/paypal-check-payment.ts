'use server';

import { PayPalOrderStatusResponse } from '@/interfaces';
import { auth } from '@/auth.config';
import { isPayPalOrderId, paymentMatchesOrder } from '@/lib/payment-validation';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const session = await auth();
  if (!session?.user?.id || !isPayPalOrderId(paypalTransactionId)) {
    return { ok: false, error: 'Unauthorized or invalid transaction ID' };
  }
  const order = await prisma.order.findFirst({
    where: { transactionId: paypalTransactionId, userId: session.user.id },
    select: { id: true, total: true, transactionId: true, isPaid: true },
  });
  if (!order) return { ok: false, error: 'Order not found' };
  if (order.isPaid) return { ok: true };

  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      error: 'Paypal authentication failed',
    };
  }

  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      error: 'Paypal payment verification failed',
    };
  }

  if (!paymentMatchesOrder(resp, order)) {
    return { ok: false, error: 'Payment does not match the order' };
  }
  const orderId = order.id;

  //! Save the update in the database
  try {
    const updated = await prisma.order.updateMany({
      where: {
        id: orderId,
        userId: session.user.id,
        transactionId: paypalTransactionId,
        isPaid: false,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    if (updated.count !== 1) return { ok: false, error: 'Order could not be updated' };

    //! Revalidate the path
    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: '500 - Error saving transaction',
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? '';

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const response = await fetch(OAUTH_URL, {
      ...requestOptions,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    }).then((r) => r.json());

    return response.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const PAYPAL_ORDER_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const resp = await fetch(PAYPAL_ORDER_URL, {
      ...requestOptions,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    }).then((r) => r.json());

    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
