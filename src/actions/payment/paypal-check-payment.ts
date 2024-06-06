'use server';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = getPaypalBearerToken();

  console.log({ authToken });

  if (!authToken) {
    return {
      ok: false,
      error: 'Paypal authentication failed',
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
    const response = await fetch(OAUTH_URL, requestOptions).then((r) =>
      r.json()
    );

    return response.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
