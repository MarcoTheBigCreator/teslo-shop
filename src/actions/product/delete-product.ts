'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProduct = async (id: string) => {
  const imageUrls = await prisma.productImage.findMany({
    where: {
      productId: id,
    },
    select: {
      url: true,
    },
  });

  const imageNames = imageUrls.map((image) => {
    // VALIDATION WHEN LOCAL IMAGES ARE IMPLEMENTED
    if (!image.url.startsWith('http')) {
      return '';
    }
    return image.url.split('/').pop()?.split('.')[0] ?? '';
  });

  try {
    try {
      imageNames.forEach(async (imageName) => {
        await cloudinary.uploader.destroy(imageName);
      });
    } catch (error) {
      return {
        ok: false,
        message: 'Error deleting product images from Cloudinary',
      };
    }
    try {
      await prisma.productImage.deleteMany({
        where: {
          productId: id,
        },
      });
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        message: 'Error deleting product images',
      };
    }
    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
      select: {
        slug: true,
      },
    });

    //! Revalidate paths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${deletedProduct.slug}`);
    revalidatePath(`/`);
    revalidatePath(`/product/${deletedProduct.slug}`);

    return {
      ok: true,
      message: `Product: ${id.split('-').at(-1)} deleted`,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error deleting product',
    };
  }
};
