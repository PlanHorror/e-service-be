export interface Review {
  proposal_id: string;
  reviewer_id: string;
  comment?: string;
  accepted: boolean;
}
