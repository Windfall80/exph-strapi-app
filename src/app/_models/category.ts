export class Category{
  id: number;
  name: string;
  slug: string;
  depth: number;
  position: number;
  parent?: Category;
  childrens?: Category[];
  group?: string;
}
