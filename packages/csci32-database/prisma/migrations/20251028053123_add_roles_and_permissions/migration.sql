-- CreateEnum
CREATE TYPE "public"."RoleName" AS ENUM ('Admin', 'Basic');

-- CreateEnum
CREATE TYPE "public"."PermissionName" AS ENUM ('UserRead', 'UserWrite');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role_id" TEXT;

-- CreateTable
CREATE TABLE "public"."Role" (
    "role_id" TEXT NOT NULL,
    "name" "public"."RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "permission_id" TEXT NOT NULL,
    "name" "public"."PermissionName" NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "public"."Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_key" ON "public"."RolePermission"("role_id", "permission_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."Permission"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
