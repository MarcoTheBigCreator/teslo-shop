'use client';

import { useHydrated } from '@/hooks/use-hydrated';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';

export const OrderSummary = () => {
  const loaded = useHydrated();
  const { itemsInCart, subTotal, taxes, Total } = useCartStore((state) =>
    state.getSummaryInformation()
  );


  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(taxes)}</span>

      <span className="mt-5 text-2xl font-semibold">Total:</span>
      <span className="mt-5 text-2xl text-right font-semibold">
        {currencyFormat(Total)}
      </span>
    </>
  );
};
