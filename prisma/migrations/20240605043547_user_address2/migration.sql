/*
  Warnings:

  - You are about to drop the column `addres2` on the `UserAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "addres2",
ADD COLUMN     "address2" TEXT;
