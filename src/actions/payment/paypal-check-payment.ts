'use server';

import { PayPalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
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

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0]; //! INVOICE ID

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      error: 'Payment not completed',
    };
  }

  //! Save the update in the database
  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

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
    }).then((r) => r.json());

    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
