export interface Review {
  proposal_id: string;
  reviewer_id: string;
  comments?: string;
  accepted: boolean;
}
