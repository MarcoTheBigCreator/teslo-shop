import Link from 'next/link';

import Image from 'next/image';

import { Title } from '@/components';
import { initialData } from '@/seed/seed';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar Orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items */}
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                  alt={product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-semibold">
                    Subtotal: ${product.price * 3}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Marco Rodriguez</p>
              <p>Av. siempre viva 123</p>
              <p>Col. Golden River</p>
              <p>San José</p>
              <p>CDMX</p>
              <p>CP 34024</p>
              <p>631232121</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$ 100</span>

              <span className="mt-5 text-2xl font-semibold">Total:</span>
              <span className="mt-5 text-2xl text-right font-semibold">
                $ 100
              </span>
            </div>

            <div className="mt-6 w-full text-center">
              <Link
                className="flex btn-primary justify-center"
                href="/orders/123"
              >
                Colocar orden
              </Link>
              <p className="mt-5">
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
        </div>
      </div>
    </div>
  );
}
