import { Offer } from "./offer";
import { User } from "./user";

export class Ticket{
  id: number;
  spent?: boolean;
  spent_for?: Offer;
  spent_by?: User;
  spent_at?: string;
  created_at?: string;
  expires_at?: string;
}
