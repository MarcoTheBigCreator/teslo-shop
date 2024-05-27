import { ProductGrid, Title } from '@/components';
import { Category } from '@/interfaces';
import { initialData } from '@/seed/seed';

const seedProducts = initialData.products;
interface Props {
  params: {
    id: Category;
  };
}

export default function ProductGridFiltered({ params }: Props) {
  const { id } = params;
  const products = seedProducts.filter((product) => product.gender === id);

  const labels: Record<Category, string> = {
    men: 'para Hombres',
    women: 'para Mujeres',
    kid: 'para Niños',
    unisex: 'para todos',
  };

  const subtitle: Record<Category, string> = {
    men: 'Todos los productos para él',
    women: 'Todos los productos para ella',
    kid: 'Todos los productos para más pequeños',
    unisex: 'Todos los productos para todos',
  };

  return (
    <>
      <Title
        title={`Articulos ${labels[id]}`}
        subtitle={subtitle[id]}
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
