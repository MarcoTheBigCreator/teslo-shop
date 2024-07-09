'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';
import { IoCartOutline } from 'react-icons/io5';
import { Button } from '@/components';

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href={'/'}>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:block">
        <Button className="p-2 m-2 font-normal" variant="ghost">
          <Link href={'/gender/men'}>Hombres</Link>
        </Button>

        <Button className="p-2 m-2 font-normal" variant="ghost">
          <Link href={'/gender/women'}>Mujeres</Link>
        </Button>

        <Button className="p-2 m-2 font-normal" variant="ghost">
          <Link href={'/gender/kid'}>Niños</Link>
        </Button>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        {/* <Link href={'/search'} className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link> */}
        <Link
          href={totalItemsInCart === 0 && loaded ? '/empty' : '/cart'}
          className="mx-2"
        >
          <div className="relative">
            {loaded && totalItemsInCart > 0 && (
              <span className="absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>
        <button
          onClick={openMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
