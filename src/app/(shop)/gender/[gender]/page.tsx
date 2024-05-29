import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function ProductGridFiltered({
  params,
  searchParams,
}: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    men: 'para Hombres',
    women: 'para Mujeres',
    kid: 'para Niños',
    unisex: 'para todos',
  };

  const subtitle: Record<string, string> = {
    men: 'Todos los productos para él',
    women: 'Todos los productos para ella',
    kid: 'Todos los productos para más pequeños',
    unisex: 'Todos los productos para todos',
  };

  return (
    <>
      <Title
        title={`Articulos ${labels[gender]}`}
        subtitle={subtitle[gender]}
        className="mb-2"
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
