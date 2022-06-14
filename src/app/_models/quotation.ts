import { Company } from "./company";
import { QuotationGroup } from "./quotation-group";
import { QuotationOffer } from "./quotation-offer";
import { QuotationStatus } from "./quotation-status";
import { Service } from "./service";
import { Supplier } from "./supplier";
import { User } from "./user";

export class Quotation{
  id: number;
  qty: number;
  details: string;
  open: boolean;

  file?: any;
  group?: QuotationGroup;
  user?: User;
  company?: Company;
  service?: Service;
  supplier?: Supplier;
  offer?: QuotationOffer;
  status?: QuotationStatus;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  discarded_at?: string;
  discard_motives?: any;
  discard_details: string;
  rating?: any;


}
