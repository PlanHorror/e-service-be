-- CreateEnum
CREATE TYPE "public"."FeedbackCategory" AS ENUM ('DICHVUCONG', 'COSOVATCHAT', 'GIAODUCDAOTAO', 'HANHCHINH', 'KHAC');

-- CreateTable
CREATE TABLE "public"."Feedback" (
    "id" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "soDienThoai" TEXT NOT NULL,
    "diaChi" TEXT NOT NULL,
    "danhMuc" "public"."FeedbackCategory" NOT NULL,
    "tieuDe" TEXT NOT NULL,
    "noiDung" TEXT NOT NULL,
    "ghiChu" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
