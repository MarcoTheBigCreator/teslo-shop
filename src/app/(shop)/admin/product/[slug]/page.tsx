import { getProductBySlug, getProductCategories } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;

  const [product, { ok, categories }] = await Promise.all([
    getProductBySlug(slug),
    getProductCategories(),
  ]);

  if (!ok) {
    return redirect('/admin/products');
  }

  //TODO: NEW

  if (!product && slug !== 'new') {
    return redirect('/admin/products');
  }

  const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

  return (
    <>
      <Title title={title} />

      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
