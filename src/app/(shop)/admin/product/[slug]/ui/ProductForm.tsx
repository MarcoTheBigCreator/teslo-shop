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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
    setIsSubmitting(true);
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
    setImagePreviews([]);
    setRedirectPath(`/admin/product/${updatedProduct?.slug}`);
    setIsSubmitting(false);
  };

  const showToast = (ok: boolean, message: string) => {
    if (!ok) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    if (!product.id) return;

    const { ok, message } = await deleteProduct(product.id);

    if (!ok) {
      setIsDeleting(false);
      toast.error(message);
      return;
    }

    if (ok) {
      showToast(ok, 'Producto eliminado');
      setRedirectPath('/admin/products');
      setIsDeleting(false);
    }
  };

  const onDeleteProductImage = async (imageId: number, imageUrl: string) => {
    setIsDeletingImage(true);
    const { ok } = await deleteProductImage(imageId, imageUrl);

    showToast(ok, ok ? 'Imagen eliminada' : 'No se pudo eliminar la imagen');

    if (ok) {
      router.refresh();
    }

    setIsDeletingImage(false);
  };

  const onImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(previews);
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
        {/* Campos de texto */}
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

        <Button
          type="submit"
          disabled={!isValid}
          isLoading={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? 'Guardando...'
            : product.id
            ? 'Actualizar Producto'
            : 'Crear Producto'}
        </Button>

        {/* Delete product button */}
        <Button
          type="button"
          onClick={onDelete}
          variant="danger"
          className={cn('w-full', {
            'cursor-not-allowed': !product.id,
          })}
          disabled={!product.id || isDeleting}
          isLoading={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar Producto'}
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
        {/* Selector de tallas */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
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

          {/* Imágenes */}
          <div className="flex flex-col mt-3">
            <span>Imágenes</span>
            <input
              type="file"
              accept="image/*"
              className="p-2 mt-2 border rounded-md bg-gray-200"
              {...register('images')}
              multiple
              onChange={onImagesSelected}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Vista previa de imágenes */}
            {imagePreviews.length > 0 && (
              <>
                {imagePreviews.map((src, idx) => (
                  <div key={idx}>
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="rounded-t-xl shadow-md object-cover w-full h-36"
                    />
                    <div className="rounded-b-xl mt-0 rounded-t-none w-full bg-blue-700 text-white py-2 px-4 text-center">
                      Preview
                    </div>
                  </div>
                ))}
              </>
            )}
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
                  disabled={isDeletingImage}
                >
                  {isDeletingImage ? 'Eliminando...' : 'Eliminar Imagen'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
