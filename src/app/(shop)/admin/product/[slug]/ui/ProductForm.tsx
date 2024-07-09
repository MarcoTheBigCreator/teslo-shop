'use client';

import { useForm } from 'react-hook-form';
import { Product, ProductImage as ProductWithImage } from '@/interfaces';
import clsx from 'clsx';
import {
  createUpdateProduct,
  deleteProduct,
  deleteProductImage,
} from '@/actions';
import { useRouter } from 'next/navigation';
import { Button, ProductImage } from '@/components';
import { cn } from '@/lib';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: {
    id: string;
    name: string;
  }[];
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch('sizes');

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues('sizes'));

    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue('sizes', Array.from(sizes));
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { images, ...productToSave } = data;

    if (product.id) {
      formData.append('id', product.id ?? '');
    }
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('gender', productToSave.gender);
    formData.append('categoryId', productToSave.categoryId);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData);

    if (!ok) {
      toast.error('No se pudo actualizar el producto');
      return;
    }

    toast.success('Producto actualizado');
    setRedirectPath(`/admin/product/${updatedProduct?.slug}`);
  };

  const showToast = (ok: boolean, message: string) => {
    if (!ok) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const onDelete = async () => {
    if (!product.id) return;

    const { ok, message } = await deleteProduct(product.id);

    if (!ok) {
      toast.error(message);
      return;
    }

    if (ok) {
      showToast(ok, 'Producto eliminado');
      setRedirectPath('/admin/products');
    }
  };

  const onDeleteProductImage = async (imageId: number, imageUrl: string) => {
    const { ok } = await deleteProductImage(imageId, imageUrl);

    showToast(ok, ok ? 'Imagen eliminada' : 'No se pudo eliminar la imagen');

    if (ok) {
      router.refresh();
    }
  };

  useEffect(() => {
    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('title', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('slug', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Precio</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register('price', { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('tags', { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Género</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('gender', { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoría</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('categoryId', { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full">
          Guardar
        </Button>

        {/* Delete product button */}
        <Button
          type="button"
          onClick={onDelete}
          variant="danger"
          className={cn('w-full', {
            'cursor-not-allowed': !product.id,
          })}
          disabled={!product.id}
        >
          Eliminar Producto
        </Button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register('inStock', { required: true, min: 0 })}
          />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  'flex p-2 cursor-pointer transition-all items-center justify-center w-10 h-10 mr-2 border rounded-md',
                  {
                    'bg-blue-500 text-white': getValues('sizes').includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register('images')}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg image/jpg image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  alt={product.title ?? ''}
                  src={image.url}
                  width={300}
                  height={300}
                  className="rounded-t-xl shadow-md object-cover w-full h-36"
                />
                <Button
                  type="button"
                  onClick={() => onDeleteProductImage(image.id, image.url)}
                  variant="danger"
                  className="rounded-b-xl mt-0 rounded-t-none w-full"
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
