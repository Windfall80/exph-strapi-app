import { Company } from "./company";
import { Supplier } from "./supplier";
import { User } from "./user";

export class Issue{
  id: number;
  type: any;
  details: string;
  screenshot: any;
  user: User;
  company?: Company;
  supplier?: Supplier;
  status?: any;
  created_at?: string;
  updated_at?: string;
}
