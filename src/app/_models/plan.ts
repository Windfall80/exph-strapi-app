import { PlanPrice } from "./plan-price";

export class Plan{
  id: number;
  name: string;
  users: number;
  order: number;
  free_tickets: number;
  grace_period: number;
  static_period_end: string;

  stripe_product_ID: string;
  perks: any[];
  prices: PlanPrice[];
}
