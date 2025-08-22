/*
  Warnings:

  - A unique constraint covering the columns `[proposal_id,reviewer_id]` on the table `ProposalReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProposalReview_proposal_id_reviewer_id_key" ON "public"."ProposalReview"("proposal_id", "reviewer_id");
