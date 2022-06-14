import { Category } from "./category";
import { Supplier } from "./supplier";

export class Service {
  id: number;
  name: string;
  description: string;
  open: boolean;

  image?: any;
  main_category?: Category;
  categories?: Category[];
  supplier?: Supplier;

  created_at: string;
  published_at: string;
  isFav: boolean;
  rating: number;
  rating_count: number;
}
