'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  // VALIDATION WHEN LOCAL IMAGES ARE IMPLEMENTED
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      message: 'Local image cannot be deleted',
    };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    await cloudinary.uploader.destroy(imageName);

    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    //! Revalidate paths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/`);
    revalidatePath(`/product/${deletedImage.product.slug}`);

    return {
      ok: true,
      message: 'Image deleted',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error deleting image',
    };
  }
};
