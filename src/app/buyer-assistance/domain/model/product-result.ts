export interface ProductResult {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  zoneName: string;
  shelfReference: string;
  promotion: string | null;
}
