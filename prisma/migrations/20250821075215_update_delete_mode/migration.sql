-- DropForeignKey
ALTER TABLE "public"."Activities" DROP CONSTRAINT "Activities_proposalType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentProposal" DROP CONSTRAINT "DocumentProposal_document_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentProposal" DROP CONSTRAINT "DocumentProposal_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentTemplate" DROP CONSTRAINT "DocumentTemplate_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."News" DROP CONSTRAINT "News_author_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposal" DROP CONSTRAINT "Proposal_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProposalReview" DROP CONSTRAINT "ProposalReview_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProposalReview" DROP CONSTRAINT "ProposalReview_reviewer_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activities" ADD CONSTRAINT "Activities_proposalType_id_fkey" FOREIGN KEY ("proposalType_id") REFERENCES "public"."ProposalTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentTemplate" ADD CONSTRAINT "DocumentTemplate_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentProposal" ADD CONSTRAINT "DocumentProposal_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentProposal" ADD CONSTRAINT "DocumentProposal_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."DocumentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProposalReview" ADD CONSTRAINT "ProposalReview_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProposalReview" ADD CONSTRAINT "ProposalReview_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
