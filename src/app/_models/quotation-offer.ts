import { User } from "./user";

export class QuotationOffer{
  id: number;
  amount: number;
  author: User;
  created_at: string;
  accepted_at: string;
  rejected_at: string;
  deliver_at: string;
  reject_details: string;
  file: any;
}
