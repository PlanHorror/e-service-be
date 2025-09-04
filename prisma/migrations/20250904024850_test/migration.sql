-- AlterTable
ALTER TABLE "public"."Activities" ALTER COLUMN "display_order" DROP NOT NULL,
ALTER COLUMN "display_order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."DocumentTemplate" ALTER COLUMN "display_order" DROP NOT NULL,
ALTER COLUMN "display_order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."ProposalTypes" ALTER COLUMN "display_order" DROP NOT NULL,
ALTER COLUMN "display_order" DROP DEFAULT;
