import { initialData } from './seed';
import { countries } from './seed-countries';
import prisma from '../lib/prisma';

async function main() {
  // 1. Erase previous data

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { users, categories, products } = initialData;

  // 0. Countries
  await prisma.country.createMany({
    data: countries,
  });

  // 1. Users
  await prisma.user.createMany({
    data: users,
  });

  // 2. Categories
  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;

    return map;
  }, {} as Record<string, string>); // <string = shirt, string = categoryID>

  // 3. Products

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // 4. Product Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log('Seed executed successfully');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;

  main();
})();
