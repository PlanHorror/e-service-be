-- AlterTable
ALTER TABLE "public"."DocumentProposal" ADD COLUMN     "pass" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."DocumentTemplate" ADD COLUMN     "example_path" TEXT;
