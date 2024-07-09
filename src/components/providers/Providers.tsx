'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
}

export const PaypalProviders = ({ children }: Props) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
        intent: 'capture',
        currency: 'USD',
      }}
    >
      <SessionProvider>{children}</SessionProvider>
    </PayPalScriptProvider>
  );
};

export const ToasterProviders = ({ children }: Props) => {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      {children}
    </>
  );
};
