export enum ProductType {
  UAV = "UAV",
  PAYLOAD = "PAYLOAD",
  ACCESSORY = "ACCESSORY",
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: ProductType;
  specifications: Record<string, string>;
  imageUrl: string;
  quoteOnly: boolean;
}