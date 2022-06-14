import { Company } from "./company";
import { Quotation } from "./quotation";
import { User } from "./user";

export class QuotationGroup{
  id: number;
  name: string;

  user?: User;
  company?: Company;
  quotations?: Quotation[];
  created_at: string;
  updated_at: string;
  published_at: string;
  status?: boolean;
}
