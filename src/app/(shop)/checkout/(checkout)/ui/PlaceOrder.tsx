'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import { Button } from '@/components';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, taxes, Total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    //! Server action
    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    //* Everything went well
    clearCart();
    router.replace('/orders/' + resp.order!.id);
  };

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
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
      </div>

      <div className="mt-6 w-full ">
        <p className="text-red-500 mb-2">{errorMessage}</p>

        <Button
          onClick={onPlaceOrder}
          isLoading={isPlacingOrder}
          className="flex justify-center"
        >
          {isPlacingOrder ? 'Procesando orden...' : 'Colocar orden'}
        </Button>
        <p className="mt-5 text-center">
          {/* Disclaimer */}
          <span className="text-xs">
            {`Al hacer clic en \"Colocar orden\", aceptas nuestros ${' '}`}
            <a href="#" className="underline">
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>
      </div>
    </div>
  );
};
