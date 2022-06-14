import { Plan } from "./plan";

export class PlanPrice{
  id: number;
  description: string;
  target: string;
  price: number;
  type: string;
  interval: string;
  interval_count: number;
  duration: string;

  stripe_price_ID: string;
  plan: Plan;
}
