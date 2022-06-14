import { Category } from './category';
import { Company } from './company';
import { Role } from './role';
import { Supplier } from './supplier';

export class User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;

  blocked: number;
  confirmed: number;
  created_at: string;
  updated_at: string;

  type: string;
  company?: Company;
  supplier?: Supplier;
  area?: Category;
  //token?: string;
  role: Role;
}
