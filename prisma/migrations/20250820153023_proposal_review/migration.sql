-- CreateTable
CREATE TABLE "public"."ProposalReview" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "comments" TEXT,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProposalReview" ADD CONSTRAINT "ProposalReview_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProposalReview" ADD CONSTRAINT "ProposalReview_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
