import { PlanPrice } from ".";
import { Category } from "./category";
import { PaymentMethod } from "./payment-method";
import { PaymentTerm } from "./payment-term";
import { Plan } from "./plan";
import { Service } from "./service";

export class Supplier {
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

  description_short: string;
  description: string;

  main_category?: Category;
  categories?: Category[];
  payment_methods?: PaymentMethod[];
  payment_terms?: PaymentTerm[];

  //files
  constitutive_act: any;
  fiscal_situation: any;
  representative_id: any;
  address_proof: any;
  profile_picture: any;

  created_at: string;
  updated_at: string;
  published_at: string;

  services?: Service[];
  plan: Plan;
  price: PlanPrice;
  subscription_status: string;
  invoice_status: string;
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;

  isFav: boolean;
  rating: number;
  rating_count: number;


}
