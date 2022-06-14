import { Category } from "./category";
import { OfferRequest } from "./offer-request";
import { Supplier } from "./supplier";
import { User } from "./user";

export class Offer {
  id: number;
  name: string;
  description: string;
  price: number;
  open: boolean;

  image?: any;
  main_category?: Category;
  categories?: Category[];
  supplier?: Supplier;
  author: User;

  created_at: string;
  published_at: string;
  expires_at: string;

  requested?: boolean;
  request?: OfferRequest;
  isFav: boolean;
}
