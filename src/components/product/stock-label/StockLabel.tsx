'use client';

import { getProductBySlug, getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts';
import { useEffect, useState } from 'react';

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const inStock = await getStockBySlug(slug);
      setStock(inStock);
      setIsLoading(false);
    };

    getStock();
  }, [slug]);

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialiased font-bold text-lg mb-2 bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1
          className={`${titleFont.className} antialiased font-bold text-lg mb-2`}
        >
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
