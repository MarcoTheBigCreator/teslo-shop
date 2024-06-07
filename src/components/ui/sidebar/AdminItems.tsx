import Link from 'next/link';
import { useUIStore } from '@/store';
import {
  IoPeopleOutline,
  IoShirtOutline,
  IoTicketOutline,
} from 'react-icons/io5';

export const AdminItems = () => {
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  return (
    <>
      {/* Line separator */}
      <div className="w-full h-px bg-gray-200 my-10" />

      <Link
        href="/admin/products"
        onClick={closeMenu}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoShirtOutline size={30} />
        <span className="ml-3 text-xl">Produdcts</span>
      </Link>

      <Link
        href="/admin/orders"
        onClick={closeMenu}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={30} />
        <span className="ml-3 text-xl">Ordenes</span>
      </Link>

      <Link
        href="/admin/users"
        onClick={closeMenu}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoPeopleOutline size={30} />
        <span className="ml-3 text-xl">Usuarios</span>
      </Link>
    </>
  );
};
