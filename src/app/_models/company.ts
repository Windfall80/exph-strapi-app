import { PlanPrice } from ".";
import { CompanyType } from "./company-type";
import { Plan } from "./plan";

export class Company {
  id: number;
  name: string;
  rfc: string;
  representative_name: string;
  business_name: string;

  address: string;
  interior_number: string;
  postal_code: string;

  country: string;
  state: string;
  city: string;
  municipality: string;
  neighborhood: String;
  phone: string;
  description: String;

  created_at: string;
  updated_at: string;
  published_at: string;

  //files
  fiscal_situation: any;
  representative_id: any;
  profile_picture: any;

  //relations
  type: CompanyType;
  plan: Plan;
  price: PlanPrice;
  subscription_status: string;
  invoice_status: string;
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
}
