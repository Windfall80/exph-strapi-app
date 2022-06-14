import { Company } from "./company";
import { Offer } from "./offer";
import { QuotationStatus } from "./quotation-status";
import { Supplier } from "./supplier";
import { User } from "./user";

export class OfferRequest{
  id: number;
  details: string;
  check: boolean;

  user?: User;
  company?: Company;
  supplier?: Supplier;
  offer?: Offer;
  status?: QuotationStatus;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  discarded_at?: string;
  discard_motives?: any;
  discard_details?: string;
  rejected_at?: string;
  reject_details?: string;
  accepted_at?: string;
  deliver_at?: string;
  rating?: any;
}
