export interface ProposalCreate {
  activity_id: string;
  code: string;
  security_code: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  note?: string;
}
