-- CreateEnum
CREATE TYPE "public"."ProposalState" AS ENUM ('DRAFT', 'SUBMITTED', 'PUBLIC');

-- AlterTable
ALTER TABLE "public"."Proposal" ADD COLUMN     "state" "public"."ProposalState" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "public"."ExtraDocumentProposal" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "attachment_path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtraDocumentProposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ExtraDocumentProposal" ADD CONSTRAINT "ExtraDocumentProposal_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
